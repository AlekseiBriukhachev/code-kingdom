export const authResponse = {
    token: "ToKen123",
    username: "JohnDoe",
    email: "johndoe@example.com",
    role: "user"
}

export const challengeResponse = {
    id: "Challenge123",
    title: "Sample Challenge",
    description: "This is a sample challenge description.",
    hint: "Try using the provided starter code.",
    starter: "console.log('Hello, World!');",
    xpReward: 100,
    coinReward: 50
}

export const codeSubmissionResponse = {
    success: true,
    message: "Code submitted successfully!",
    xpEarned: 100,
    coinsEarned: 50,
    newBuilding: "Data Warehouse",
    gameState: {
        xp: 150,
        level: 2,
        coins: 200,
        buildings: ["Startup Garage"],
        unlockedModules: ["Module1"],
        completedChallenges: ["Challenge1"]
    }
}

export const gameStateResponse = {
    xp: 150,
    level: 2,
    coins: 200,
    buildings: ["Startup Garage"],
    unlockedModules: ["Module1"],
    completedChallenges: ["Challenge1"]
}

export const moduleResponse = [{
    id: "basics",
    name: "Java Basics",
    icon: "🏠",
    description: "Learn variables, data types, and basic syntax",
    xpRequired: 0,
    building: "Startup Garage",
    challenges: [
        {
            id: "basics-1",
            title: "Your First Variable",
            description: "Create a String variable named \"companyName\" with value \"CodeKingdom\"",
            hint: "Use: String variableName = \"value\";",
            starter: "// Create your variable here\n",
            xpReward: 50,
            coinReward: 10,
            validation: true
        }
    ]
}]