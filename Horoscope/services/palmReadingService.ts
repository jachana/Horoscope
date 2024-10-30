interface PalmReading {
    lifeLine: string;
    heartLine: string;
    headLine: string;
    fateDestinyLine: string;
    generalReading: string;
}

// Simulated palm reading responses
const palmReadings: PalmReading[] = [
    {
        lifeLine: "Your life line indicates a long and healthy life. The deep curve suggests vitality and resilience.",
        heartLine: "Your heart line reveals emotional depth and strong relationships. You value deep connections.",
        headLine: "Your head line shows analytical thinking and creative problem-solving abilities.",
        fateDestinyLine: "Your fate line suggests a strong career path with opportunities for growth.",
        generalReading: "Your palm reveals a balanced life with strong potential for personal and professional success."
    },
    {
        lifeLine: "The branches in your life line indicate adaptability and multiple life-changing events.",
        heartLine: "Your heart line shows passion and romantic nature, with careful consideration in relationships.",
        headLine: "A strong head line indicates logical thinking and good decision-making abilities.",
        fateDestinyLine: "Multiple fate lines suggest diverse career opportunities and flexibility in life path.",
        generalReading: "Your palm shows a dynamic life path with multiple opportunities for growth and success."
    },
    // Add more variations as needed
];

export const getPalmReading = async (): Promise<PalmReading> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Return a random reading
    return palmReadings[Math.floor(Math.random() * palmReadings.length)];
};

export type { PalmReading };
