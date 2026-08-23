const { cert, initializeApp } = require("firebase-admin/app");
const { getAuth } = require("firebase-admin/auth");

const serviceAccount = require("./token-verify.json");

initializeApp({
    credential: cert(serviceAccount)
});

const auth = getAuth();

async function testFirebase() {
    try {
        const user = await auth.getUser("uJZxf0XOQyVezugklbUWlOMq7jQ2");

        console.log("✅ Firebase Admin works");
        console.log("UID:", user.uid);
        console.log("Email:", user.email);

    } catch (error) {
        console.log("❌ Firebase Admin failed");
        console.log("CODE:", error.code);
        console.log("MESSAGE:", error.message);
        console.log("STACK:", error.stack);
    }
}

testFirebase();