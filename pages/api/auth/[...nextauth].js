import NextAuth from "next-auth";
// import Providers from "next-auth/providers";
import CognitoProvider from "next-auth/providers/cognito";

export default NextAuth({
  providers: [
    CognitoProvider({
      clientId: process.env.COGNITO_CLIENT_ID,
      clientSecret: process.env.COGNITO_CLIENT_SECRET,
      issuer: process.env.COGNITO_ISSUER,
      domain: process.env.COGNITO_DOMAIN,
    }),
  ],
  debug: process.env.NODE_ENV === "development" ? true : false,
  pages: {
    signIn: "/auth/signin",
  },
});
