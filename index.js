const express = require("express");
const parser = require("body-parser");
const jwt = require("jsonwebtoken");

const username = "hallixon";
const password = "@Password1";

const payload = {
	sub: 1234567890,
	name: "Emmanuel Allison",
	role: "admin",
	age: 31,
};
const secret = "Shhhh! This is a secret";

var app = express();
app.use(parser.json()); // This parses the body of the requests to a JSON object.

app.post("/auth", (req, res) => {
    if (req.body.username == username && req.body.password == password) {
        // Sign the JWT.
        const signed = jwt.sign(payload, secret, {
            algorithm: "HS256",
            expiresIn: "60s"    // The token won't expire if this is left out.
        });
        return res.send(signed);
    }
    res.status(401).send("Not authenticated.");
});

app.post("/verify", (req, res) => {
    jwt.verify(req.body.jwt, secret, {
        // Always indicate the algorithm to avoid alg stripping attacks.
        algorithms: ["HS256"]
    }, (error, decoded) => {
        if (error) return res.status(401).send("Invalid or expired token.");
		res.send(
			`Hi ${decoded.name}, you are an ${decoded.role}, and you are ${decoded.age} years old.`
		);
    })
})

app.listen(3000);