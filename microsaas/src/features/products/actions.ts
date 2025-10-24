"use server";

import { createClient } from "@/utils/supabase/server";
import { Product } from "./types";
import { revalidatePath } from "next/cache";

export async function handleUpvoteAction(product: Product) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      throw new Error("You must be logged in to upvote products");
    }

    if (product.is_upvoted) {
      const { data: deletedUpvote, error: deleteError } = await supabase
        .from("upvotes")
        .delete()
        .eq("product_id", product.id)
        .eq("user_id", user.id)
        .select();

      if (deleteError) {
        throw new Error("Failed to remove upvote. Please try again.");
      }

      revalidatePath("/");
      
      return { success: true, action: "removed", data: deletedUpvote };
    } else {
      const { data: insertedUpvote, error: insertError } = await supabase
        .from("upvotes")
        .insert({
          user_id: user.id,
          product_id: product.id,
        })
        .select();

      if (insertError) {        
        if (insertError.code === "23505") {
          throw new Error("You have already upvoted this product");
        }
        
        throw new Error("Failed to add upvote. Please try again.");
      }

      revalidatePath("/");
      
      return { success: true, action: "added", data: insertedUpvote };
    }
  } catch (error) {
    console.error("Upvote action error:", error);
    
    if (error instanceof Error) {
      throw error;
    }
    
    throw new Error("Something went wrong. Please try again.");
  }
}
