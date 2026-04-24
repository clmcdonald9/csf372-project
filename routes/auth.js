const express = require('express');
const { sha256} = require('js-sha256');
const { getDB } = require ('../db');
const router = express.Router();

router.post('/login', async (req, res) => {
    const { username, password } = req.body;
    const db = getDB();

    const hashedPassword = sha256(password);

    try {
        const user = await db.collection('users').findOne({ 
            username: username, 
            password: hashedPassword 
        });

        if (!user) {
            return res.status(401).json({ 
                success: false, 
                message: 'Invalid username or password' 
            });
        }

        req.session.user = { 
            id: user._id, 
            username: user.username, 
            fullName: user.fullName, 
            role: user.role 
        };

        res.json({ 
            success: true, 
            message: 'Login successful', 
            user: { 
                username: user.username, 
                fullName: user.fullName, role: user.role, 
                firstLogin: user.firstLogin 
            } 
        });
        
    } catch (error) {
        console.log('Error during login:', error);
        res.status(500).json({ 
            success: false, 
            message: 'An error occurred during login' 
        });
    }
});

router.post('/user', (req, res) => {
    if (req.session.user) {
        res.json({ loggedIn: true, user: req.session.user });
    } else {
        res.json({ loggedIn: false });
    }
});

router.post('/security-questions', async (req, res) => {
    console.log("Received request for security questions")
    const { username } = req.body;
    const db = getDB();

    try {
        const user = await db.collection('users').findOne({ username: username });
        
        if (!user) {
            return res.status(404).json({ 
                success: false, 
                message: 'User not found' });
        }
        
        const questions = user.recoveryQuestions.map(q => ({ 
            question: q.question 
        }));

        res.json({ success: true, questions });

    } catch (error) {
        console.log('Error retrieving security questions:', error);
        res.status(500).json({ 
            success: false, 
            message: 'An error occurred while retrieving security questions' 
        });
    }
});

router.post('/update-password', async (req, res) => {
    const { username, answer1, answer2, newPassword } = req.body;
    const db = getDB();

    const hashedNewPassword = sha256(newPassword);
    const hashedAnswer1 = sha256(answer1);
    const hashedAnswer2 = sha256(answer2);

    try {
        const user = await db.collection('users').findOne({ username: username });

        if (!user) {
            return res.status(404).json({ 
                success: false, 
                message: 'User not found' 
            });
        }

        const correctAnswer1 = user.recoveryQuestions[0].answer;
        const correctAnswer2 = user.recoveryQuestions[1].answer;

        if (hashedAnswer1 !== correctAnswer1 || hashedAnswer2 !== correctAnswer2) {
            return res.status(401).json({ 
                success: false, 
                message: 'Incorrect security question answers' 
            });
        }

        await db.collection('users').updateOne(
            { username }, 
            { $set: { password: hashedNewPassword } }
        );

        res.json({ success: true, message: 'Password updated successfully' });

    } catch (error) {
        console.log('Error updating password:', error);
        res.status(500).json({ 
            success: false, 
            message: 'An error occurred while updating the password' 
        });
    }
});

router.post('/update-user-account', async (req, res) => {
    const { 
        username, 
        question1, 
        question2, 
        answer1, 
        answer2, 
        newPassword 
    } = req.body;

    const db = getDB();

    const hashedNewPassword = sha256(newPassword);
    const hashedAnswer1 = sha256(answer1);
    const hashedAnswer2 = sha256(answer2);

    try {
        const user = await db.collection('users').findOne({ username: username });

        if (!user) {
            return res.status(404).json({ 
                success: false, 
                message: 'User not found' 
            });
        }

        await db.collection('users').updateOne(
            { username },
            { $set: { 
                password: hashedNewPassword,
                recoveryQuestions: [
                    { question: question1, answer: hashedAnswer1 },
                    { question: question2, answer: hashedAnswer2 }
                ],
                firstLogin: false
            } 
        });

        res.json({ 
            success: true, 
            message: 'User account updated successfully' });

    } catch (error) {
        console.log('Error updating user account:', error);
        res.status(500).json({ 
            success: false, 
            message: 'An error occurred while updating the user account' 
        });
    }
});

module.exports = router