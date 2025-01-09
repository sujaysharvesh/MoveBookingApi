import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import prisma from "../../utils/prisma.js"

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_SECRET,
      callbackURL: "/auth/google/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        let user = await prisma.user.findUnique({
          where: { email: profile.emails[0].value },
        });

        if (!user) {
          user = await prisma.user.create({
            data: {
              username: profile.displayName,
              email: profile.emails[0].value,
              oauthProvider: "google",
              oauthId: profile.id,
            },
          });
        }

        return done(null, user); 
      } catch (err) {
        return done(err, null); 
      }
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await prisma.user.findUnique({ where: { id } });
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});




export default passport;

