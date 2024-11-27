import bcrypt from 'bcryptjs';

export const hashPassword = async (plainPassword: string): Promise<string> => {
    const salt = bcrypt.genSaltSync(10); // Generate salt
    const hashedPassword = bcrypt.hashSync(plainPassword, salt); // Hash password
    return hashedPassword;
};

export const verifyPassword = async (plainPassword: string, hashedPassword: string): Promise<boolean> => {
    return bcrypt.compareSync(plainPassword, hashedPassword); // Compare passwords
};
