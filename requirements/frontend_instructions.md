# Project overview

# Feature requirements

# Relevant docs
##How authentication flows work in Clerk
Before building custom authentication flows, read the following sections to get a general understanding of how authentication flows work in Clerk.

Sign-up flow
The SignUp object is the pivotal concept in the sign-up process. It is used to gather the user's information, verify their email address or phone number, add OAuth accounts, and finally, convert them into a User.

Every SignUp must meet specific requirements before being converted into a User. These requirements are defined by the instance settings you selected in the Clerk Dashboard. For example, on the Email, phone, username page, you can configure email and password, email links, or SMS OTP as authentication strategies.

Once all requirements are met, the SignUp will turn into a new User, and an active session for that User will be created on the current Client.

Don't worry about collecting all the required fields at once and passing them to a single request. The API is designed to accommodate progressive multi-step sign-up forms.

The following steps outline the sign-up process:

Initiate the sign-up process by collecting the user's authentication information and passing the appropriate parameters to the create() method.
Prepare the verification.
Attempt to complete the verification.
If the verification is successful, set the newly created session as the active session by passing the SignIn.createdSessionId to the setActive() method on the Clerk object.
The state of a SignUp
The SignUp object will show the state of the current sign-up in the status property.

If you need further help on where things are and what you need to do next, you can also consult the required_fields, optional_fields, and missingFields properties.

requiredFields
All fields that must be collected before the SignUp converts into a User.

optionalFields
All fields that can be collected, but are not necessary to convert the SignUp into a User.

missingFields
A subset of requiredFields. It contains all fields that still need to be collected before a SignUp can be converted into a User. Note that this property will be updated dynamically. As you add more fields to the SignUp, they will be removed. Once this property is empty, your SignUp will automatically convert into a User.

Verified fields
Some properties of the SignUp, such as emailAddress and phoneNumber, must be verified before they are fully added to the SignUp object.

The SignUp object will show the state of verification in the following properties:

unverifiedFields
A list of all User attributes that need to be verified and are pending verification. This is a list that gets updated dynamically. When verification for all required fields has been successfully completed, this value will become an empty array.

verifications
An object that describes the current state of verification for the SignUp. There are currently three different keys: email_address, phone_number, and external_account.

Sign-in flow
The SignIn object is the pivotal concept in the sign-in process.

Sign-ins are initiated by creating a SignIn object on the current Client. If the sign-in is successfully authenticated, it will transform into an active session for that User on the current Client.

The following steps outline the sign-in process:

Initiate the sign-in process by collecting the user's authentication information and passing the appropriate parameters to the create() method.
Prepare the first factor verification. Users must complete a first factor verification to prove their identity. This can be something like providing a password, an email link, a one-time code (OTP), a Web3 wallet address, or providing proof of their identity through an external social account (SSO/OAuth).
Attempt to complete the first factor verification.
Optionally, if you have enabled multi-factor for your application, you will need to prepare the second factor verification for users who have set up 2FA for their account.
Attempt to complete the second factor verification.
If verification is successful, set the newly created session as the active session by passing the SignIn.createdSessionId to the setActive() method on the Clerk object.

# Current file structure
votist/
├── docker-compose.yml
├── Dockerfile
├── drizzle.config.ts
├── eslint.config.js
├── package-lock.json
├── package.json
├── postcss.config.js
├── prisma/
│   ├── migrations/
│   │   ├── 20250601025048_init/
│   │   │   └── migration.sql
│   │   ├── 20250609222959_add_is_admin/
│   │   │   └── migration.sql
│   │   ├── 20250613011205_add_no_opinion_option/
│   │   │   └── migration.sql
│   │   ├── 20250613020654_move_points_to_quiz/
│   │   │   └── migration.sql
│   │   ├── 20250613035040_add_no_opinion_option/
│   │   │   └── migration.sql
│   │   ├── 20250619052219_first/
│   │   │   └── migration.sql
│   │   └── migration_lock.toml
│   └── schema.prisma
├── README.md
├── requirements/
│   └── frontend_instructions.md
├── src/
│   ├── app.css
│   ├── app.d.ts
│   ├── app.html
│   ├── demo.spec.ts
│   ├── hooks.server.ts
│   ├── lib/
│   │   ├── assets/
│   │   │   ├── 1.mp4
│   │   │   ├── Coffee.svg
│   │   │   ├── google-icon.png
│   │   │   ├── logo/
│   │   │   │   ├── logo-white.png
│   │   │   │   └── votist-logo.png
│   │   │   ├── quiz/
│   │   │   │   ├── Group 8.svg
│   │   │   │   ├── Isolation_Mode.svg
│   │   │   │   ├── Knowlege Icon.svg
│   │   │   │   ├── Status Icon.png
│   │   │   │   └── Status Icon.svg
│   │   │   └── quiz1.png
│   │   ├── clerk.d.ts
│   │   ├── components/
│   │   │   ├── HeroCard.svelte
│   │   │   ├── quiz/
│   │   │   │   ├── CompletedScreen.svelte
│   │   │   │   ├── FeedbackScreen.svelte
│   │   │   │   ├── LevelsList.svelte
│   │   │   │   ├── QuestionScreen.svelte
│   │   │   │   ├── QuizRoadmap.svelte
│   │   │   │   ├── StartScreen.svelte
│   │   │   │   └── TryAgainScreen.svelte
│   │   │   ├── QuizProgressBar.svelte
│   │   │   ├── Tabs.svelte
│   │   │   ├── UserLoader.svelte
│   │   │   └── VotingProgressBar.svelte
│   │   ├── index.ts
│   │   ├── proposals/
│   │   │   ├── housing1.png
│   │   │   └── san-rafael.png
│   │   ├── server/
│   │   │   ├── auth.ts
│   │   │   ├── db/
│   │   │   │   ├── index.ts
│   │   │   │   ├── prisma.ts
│   │   │   │   └── schema.ts
│   │   └── types.ts
│   ├── routes/
│   │   ├── +layout.server.ts
│   │   ├── +layout.svelte
│   │   ├── +page.server.ts
│   │   ├── +page.svelte
│   │   ├── admin/
│   │   │   ├── +layout.server.ts
│   │   │   ├── +layout.svelte
│   │   │   ├── +page.svelte
│   │   │   └── quizzes/
│   │   │       ├── [id]/
│   │   │       │   └── edit/
│   │   │       │       ├── +page.server.ts
│   │   │       │       └── +page.svelte
│   │   │       ├── +layout.svelte
│   │   │       ├── +page.svelte
│   │   │       └── components/
│   │   │           ├── QuizEdit.svelte
│   │   │           ├── QuizForm.svelte
│   │   │           └── QuizList.svelte
│   │   ├── api/
│   │   │   ├── quiz-progress/
│   │   │   │   └── +server.ts
│   │   │   ├── quizzes/
│   │   │   │   ├── [id]/
│   │   │   │   │   ├── +server.ts
│   │   │   │   │   └── start/
│   │   │   │   │       └── +server.ts
│   │   │   │   └── +server.ts
│   │   │   └── users/
│   │   │       └── init/
│   │   │           └── +server.ts
│   │   ├── auth/
│   │   │   ├── forgot-password/
│   │   │   │   └── +page.svelte
│   │   │   ├── login/
│   │   │   │   └── +page.svelte
│   │   │   ├── register/
│   │   │   │   ├── email/
│   │   │   │   │   └── +page.svelte
│   │   │   │   ├── name/
│   │   │   │   │   └── +page.svelte
│   │   │   │   ├── phone/
│   │   │   │   │   └── +page.svelte
│   │   │   │   ├── verify/
│   │   │   │   │   └── +page.svelte
│   │   │   │   └── +page.svelte
│   │   │   ├── reset-password-verification/
│   │   │   │   └── +page.svelte
│   │   │   ├── +layout.svelte
│   │   │   └── +page.svelte
│   │   ├── contact/
│   │   │   └── +page.svelte
│   │   ├── learn-more/
│   │   │   └── +page.svelte
│   │   ├── proposals/
│   │   │   └── +page.svelte
│   │   ├── quiz/
│   │   │   ├── +layout.svelte
│   │   │   ├── +page.svelte
│   │   │   └── a_step/
│   │   │       └── +page.svelte
│   │   ├── sign-in/
│   │   │   ├── +page.svelte
│   │   │   └── +server.ts
│   │   ├── sign-out/
│   │   │   └── +page.svelte
│   │   ├── sign-up/
│   │   │   ├── +page.svelte
│   │   │   └── +server.ts
│   ├── stores/
│   │   └── quizStore.ts
│   └── util/
│       └── image.ts
├── static/
│   └── favicon.png
├── svelte.config.js
├── tsconfig.json
├── vercel.json
└── vite.config.ts