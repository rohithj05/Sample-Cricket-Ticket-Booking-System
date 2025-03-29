
// Follow this setup guide to integrate the Deno runtime into your application:
// https://deno.com/manual/runtime/manual/integrations/bundlers

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.4";
import { corsHeaders } from "../_shared/cors.ts";

interface RedeemRequest {
  rewardId: string;
}

serve(async (req: Request) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    );

    // Get user session
    const { data: { session }, error: authError } = await supabaseClient.auth.getSession();
    
    if (authError || !session) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized', message: 'You must be logged in to redeem rewards' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Parse request body
    const { rewardId } = await req.json() as RedeemRequest;
    
    if (!rewardId) {
      return new Response(
        JSON.stringify({ error: 'Bad Request', message: 'Reward ID is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Get user's current points
    const { data: profileData, error: profileError } = await supabaseClient
      .from('profiles')
      .select('points')
      .eq('id', session.user.id)
      .single();
    
    if (profileError) {
      return new Response(
        JSON.stringify({ error: 'Database Error', message: 'Could not retrieve user profile' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Get reward details
    const { data: rewardData, error: rewardError } = await supabaseClient
      .from('rewards')
      .select('points_required, name, available')
      .eq('id', rewardId)
      .single();
    
    if (rewardError || !rewardData) {
      return new Response(
        JSON.stringify({ error: 'Not Found', message: 'Reward not found' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Check if reward is available
    if (!rewardData.available) {
      return new Response(
        JSON.stringify({ error: 'Bad Request', message: 'This reward is currently unavailable' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Check if user has enough points
    const currentPoints = profileData?.points || 0;
    
    if (currentPoints < rewardData.points_required) {
      return new Response(
        JSON.stringify({ 
          error: 'Bad Request', 
          message: `Not enough points. You need ${rewardData.points_required - currentPoints} more points.` 
        }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Create redemption record
    const { error: insertError } = await supabaseClient
      .from('redemptions')
      .insert({
        user_id: session.user.id,
        reward_id: rewardId,
        points_spent: rewardData.points_required,
        status: 'redeemed'
      });
    
    if (insertError) {
      return new Response(
        JSON.stringify({ error: 'Database Error', message: 'Failed to create redemption record' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Update user points
    const { error: updateError } = await supabaseClient
      .from('profiles')
      .update({ points: currentPoints - rewardData.points_required })
      .eq('id', session.user.id);
    
    if (updateError) {
      return new Response(
        JSON.stringify({ error: 'Database Error', message: 'Failed to update user points' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Return successful response
    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Reward redeemed successfully',
        data: {
          rewardName: rewardData.name,
          pointsSpent: rewardData.points_required,
          remainingPoints: currentPoints - rewardData.points_required
        }
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
    
  } catch (error) {
    console.error('Error processing redemption:', error);
    
    return new Response(
      JSON.stringify({ error: 'Internal Server Error', message: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
