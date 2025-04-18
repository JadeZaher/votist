declare module '@clerk/clerk-js' {
    export class Clerk {
      constructor(publishableKey: string);
      load(options?: {
        afterSignIn?: (session: any) => void;
        afterSignOut?: () => void;
      }): Promise<void>;
      signOut(): Promise<void>;
      setActive(options: { session: string }): Promise<void>;
      
      client: {
        signUp: {
          create(options: {
            emailAddress: string;
            password: string;
            firstName?: string;
            lastName?: string;
            phoneNumber?: string;
          }): Promise<any>;
        };
        signIn: {
          create(options: {
            identifier?: string;
            password?: string;
            strategy?: string;
          }): Promise<any>;
          forgotPassword: {
            create(email: string): Promise<void>;
          };
        };
      };
  
      user: any;
    }
  }