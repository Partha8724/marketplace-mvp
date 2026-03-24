export type ActionState = {
  success: boolean;
  message?: string;
  errors?: Record<string, string[] | undefined>;
  redirectTo?: string;
};

export const successState = (message?: string, redirectTo?: string): ActionState => ({
  success: true,
  message,
  redirectTo,
});

export const failureState = (message: string, errors?: Record<string, string[] | undefined>): ActionState => ({
  success: false,
  message,
  errors,
});
