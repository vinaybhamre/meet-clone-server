import bcrypt from "bcryptjs";

export async function getHashedPassword(password: string) {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(password, salt);
}

export async function verifyPassword(hashed: string, password: string) {
  return bcrypt.compare(password, hashed);
}
