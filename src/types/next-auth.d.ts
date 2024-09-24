import "next-auth";
import { DefaultSession } from "next-auth";

declare module "next-auth" {
	interface User {
		_id?: string;
		isVerified?: boolean;
		isAcceptingMessages?: boolean;
		username?: string;
		email?: string;
		name?: string;
	}

	interface Session {
		user: {
			_id?: string;
			isVerified?: boolean;
			isAcceptingMessages?: boolean;
			username?: string;
			email?: string;
			name?: string;
		} & DefaultSession["user"];
	}
}

// Other way to declare

declare module "next-auth/jwt" {
  interface JWT {
		_id?: string;
		isVerified?: boolean;
		isAcceptingMessages?: boolean;
		username?: string;
		email?: string;
		name?: string;
	}
}
