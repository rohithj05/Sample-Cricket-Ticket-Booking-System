
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface Reward {
  id: string;
  name: string;
  description: string;
  pointsRequired: number;
  category: string;
  image: string;
  available: boolean;
}

export interface Redemption {
  id: string;
  rewardName: string;
  pointsSpent: number;
  date: string;
  status: string;
}

export const fetchRewards = async (): Promise<Reward[]> => {
  try {
    const { data, error } = await supabase
      .from('rewards')
      .select('*')
      .order('points_required', { ascending: true });
    
    if (error) throw error;
    
    return data.map(reward => ({
      id: reward.id,
      name: reward.name,
      description: reward.description,
      pointsRequired: reward.points_required,
      category: reward.category,
      image: reward.image,
      available: reward.available
    }));
  } catch (error) {
    console.error('Error fetching rewards:', error);
    toast.error('Failed to load rewards');
    return [];
  }
};

export const fetchUserPoints = async (): Promise<number> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) return 0;
    
    const { data, error } = await supabase
      .from('profiles')
      .select('points')
      .eq('id', user.id)
      .single();
    
    if (error) throw error;
    
    return data?.points || 0;
  } catch (error) {
    console.error('Error fetching user points:', error);
    return 0;
  }
};

export const fetchRedemptionHistory = async (): Promise<Redemption[]> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) return [];
    
    const { data, error } = await supabase
      .from('redemptions')
      .select(`
        id,
        points_spent,
        status,
        created_at,
        rewards (
          name
        )
      `)
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    
    return data.map(item => ({
      id: item.id,
      rewardName: item.rewards.name,
      pointsSpent: item.points_spent,
      date: item.created_at,
      status: item.status
    }));
  } catch (error) {
    console.error('Error fetching redemption history:', error);
    toast.error('Failed to load redemption history');
    return [];
  }
};

export const redeemReward = async (rewardId: string, pointsRequired: number): Promise<boolean> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      toast.error('You must be logged in to redeem rewards');
      return false;
    }
    
    // Check user's current points
    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .select('points')
      .eq('id', user.id)
      .single();
    
    if (profileError) throw profileError;
    
    const currentPoints = profileData?.points || 0;
    
    if (currentPoints < pointsRequired) {
      toast.error(`Not enough points. You need ${pointsRequired - currentPoints} more points.`);
      return false;
    }
    
    // Since we're getting a type error with the RPC call, let's remove it
    // and use the manual transaction instead
    
    // Create redemption record
    const { error: insertError } = await supabase
      .from('redemptions')
      .insert({
        user_id: user.id,
        reward_id: rewardId,
        points_spent: pointsRequired,
        status: 'redeemed'
      });
    
    if (insertError) throw insertError;
    
    // Update user points
    const { error: updateError } = await supabase
      .from('profiles')
      .update({ points: currentPoints - pointsRequired })
      .eq('id', user.id);
    
    if (updateError) throw updateError;
    
    toast.success('Reward redeemed successfully!');
    return true;
  } catch (error) {
    console.error('Error redeeming reward:', error);
    toast.error('Failed to redeem reward');
    return false;
  }
};
