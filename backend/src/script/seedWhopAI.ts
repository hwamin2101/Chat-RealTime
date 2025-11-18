import "dotenv/config";
import UserModel from "../models/user.model";
import connectDatabase from "../config/database.config";


export const CreateWhoopAI = async () => {
  const existingAI = await UserModel.findOne({ isAI: true});
  if (existingAI) {
    await UserModel.deleteOne({ _id: existingAI._id });
  }
const WhopAI = await UserModel.create({
    name: "Whop AI",
    isAI: true,
    avatar: "https://res.cloudinary.com/dhhwnw39k/image/upload/v1763392707/whop-ai-logo_boge5k.png",
  });
  console.log("Whop AI user created.", WhopAI._id);
  return WhopAI;
};

const seedWhopAI = async () => {
  try {
    await connectDatabase();
    await CreateWhoopAI();
    console.log("Seeding completed.");
    process.exit(0);
  } catch (error) {
    console.error("Seeding failed:", error);
    process.exit(1);
  }
};
seedWhopAI();

