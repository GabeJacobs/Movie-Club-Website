const movies = [
    {
        title: "Ratcatcher",
        picker: "Shane",
        ratings: { Gabe: "8", Isa: "7", Shane: "9", Bo: "8", Andrew: "-", Rachel: "" },
        average: 8,
        dateAdded: "2024-09-07T19:00:00.000Z"
    },
    {
        title: "Burning",
        picker: "Gabe",
        ratings: { Gabe: "7", Isa: "8", Shane: "6", Bo: "7", Andrew: "9", Rachel: "" },
        average: 7.4,
        dateAdded: "2024-09-14T19:00:00.000Z"
    },
    {
        title: "The Long Goodbye",
        picker: "Bo",
        ratings: { Gabe: "7", Isa: "6", Shane: "8", Bo: "9", Andrew: "9", Rachel: "" },
        average: 7.8,
        dateAdded: "2024-09-21T19:00:00.000Z"
    },
    {
        title: "Volver",
        picker: "Isa",
        ratings: { Gabe: "10", Isa: "9", Shane: "8", Bo: "9", Andrew: "High 9", Rachel: "" },
        average: 9,
        dateAdded: "2024-09-28T19:00:00.000Z"
    },
    {
        title: "A Hero",
        picker: "Andrew",
        ratings: { Gabe: "7", Isa: "8", Shane: "9", Bo: "8", Andrew: "8", Rachel: "" },
        average: 8,
        dateAdded: "2024-10-05T19:00:00.000Z"
    },
    {
        title: "Far From Heaven",
        picker: "Shane",
        ratings: { Gabe: "6", Isa: "6", Shane: "6", Bo: "6", Andrew: "-", Rachel: "" },
        average: 6,
        dateAdded: "2024-10-12T19:00:00.000Z"
    },
    {
        title: "Cold War",
        picker: "Gabe",
        ratings: { Gabe: "8", Isa: "7", Shane: "7", Bo: "7", Andrew: "8", Rachel: "" },
        average: 7.4,
        dateAdded: "2024-10-19T19:00:00.000Z"
    },
    {
        title: "Blowup",
        picker: "Bo",
        ratings: { Gabe: "7", Isa: "7", Shane: "7", Bo: "8", Andrew: "9", Rachel: "" },
        average: 7.6,
        dateAdded: "2024-10-26T19:00:00.000Z"
    },
    {
        title: "The Second Mother",
        picker: "Isa",
        ratings: { Gabe: "8", Isa: "9", Shane: "8", Bo: "8", Andrew: "-", Rachel: "" },
        average: 8.25,
        dateAdded: "2024-11-02T19:00:00.000Z"
    },
    {
        title: "Certain Women",
        picker: "Shane",
        ratings: { Gabe: "6", Isa: "8", Shane: "7", Bo: "7", Andrew: "-", Rachel: "" },
        average: 7,
        dateAdded: "2024-11-09T20:00:00.000Z"
    },
    {
        title: "Woman In The Dunes",
        picker: "Gabe",
        ratings: { Gabe: "10", Isa: "9", Shane: "9", Bo: "9", Andrew: "-", Rachel: "" },
        average: 9.25,
        dateAdded: "2024-11-16T20:00:00.000Z"
    },
    {
        title: "The Manchurian Candidate",
        picker: "Bo",
        ratings: { Gabe: "7", Isa: "7", Shane: "5", Bo: "7", Andrew: "-", Rachel: "" },
        average: 6.5,
        dateAdded: "2024-11-23T20:00:00.000Z"
    },
    {
        title: "Saturday Night Fever",
        picker: "Isa",
        ratings: { Gabe: "8", Isa: "8", Shane: "6", Bo: "6", Andrew: "-", Rachel: "" },
        average: 7,
        dateAdded: "2024-11-30T20:00:00.000Z"
    },
    {
        title: "Sans Soleil",
        picker: "Shane",
        ratings: { Gabe: "6", Isa: "", Shane: "8", Bo: "8", Andrew: "-", Rachel: "" },
        average: 7.33,
        dateAdded: "2024-12-07T20:00:00.000Z"
    },
    {
        title: "Barton Fink",
        picker: "Gabe",
        ratings: { Gabe: "10", Isa: "7", Shane: "10", Bo: "8", Andrew: "9", Rachel: "" },
        average: 8.8,
        dateAdded: "2024-12-14T20:00:00.000Z"
    },
    {
        title: "Body Double",
        picker: "Bo",
        ratings: { Gabe: "7", Isa: "", Shane: "7", Bo: "8", Andrew: "-", Rachel: "" },
        average: 7.33,
        dateAdded: "2024-12-21T20:00:00.000Z"
    },
    {
        title: "Mulholland Dr",
        picker: "Andrew",
        ratings: { Gabe: "8", Isa: "", Shane: "9", Bo: "10", Andrew: "9", Rachel: "" },
        average: 9,
        dateAdded: "2024-12-28T20:00:00.000Z"
    },
    {
        title: "The Witch",
        picker: "Isa",
        ratings: { Gabe: "8", Isa: "", Shane: "9", Bo: "7", Andrew: "8", Rachel: "" },
        average: 8,
        dateAdded: "2025-01-04T20:00:00.000Z"
    },
    {
        title: "Black Girl",
        picker: "Shane",
        ratings: { Gabe: "7", Isa: "", Shane: "8", Bo: "8", Andrew: "8", Rachel: "" },
        average: 7.75,
        dateAdded: "2025-01-11T20:00:00.000Z"
    },
    {
        title: "Amadeus",
        picker: "Gabe",
        ratings: { Gabe: "9", Isa: "", Shane: "9", Bo: "8", Andrew: "7", Rachel: "" },
        average: 8.25,
        dateAdded: "2025-01-18T20:00:00.000Z"
    },
    {
        title: "Pather Panchali",
        picker: "Bo",
        ratings: { Gabe: "9", Isa: "", Shane: "8", Bo: "8", Andrew: "-", Rachel: "" },
        average: 8.33,
        dateAdded: "2025-01-25T20:00:00.000Z"
    },
    {
        title: "Serpico",
        picker: "Andrew",
        ratings: { Gabe: "7", Isa: "", Shane: "7", Bo: "8", Andrew: "9", Rachel: "" },
        average: 7.75,
        dateAdded: "2025-02-01T20:00:00.000Z"
    },
    {
        title: "Wall Street",
        picker: "Isa",
        ratings: { Gabe: "7", Isa: "", Shane: "4", Bo: "5", Andrew: "7", Rachel: "" },
        average: 5.75,
        dateAdded: "2025-02-08T20:00:00.000Z"
    },
    {
        title: "Minding the Gap",
        picker: "Shane",
        ratings: { Gabe: "10", Isa: "", Shane: "8", Bo: "8", Andrew: "10", Rachel: "" },
        average: 9,
        dateAdded: "2025-02-15T20:00:00.000Z"
    },
    {
        title: "The Face of Another",
        picker: "Gabe",
        ratings: { Gabe: "8", Isa: "", Shane: "7", Bo: "8", Andrew: "8", Rachel: "" },
        average: 7.75,
        dateAdded: "2025-02-22T20:00:00.000Z"
    },
    {
        title: "To Sleep with Anger",
        picker: "Bo",
        ratings: { Gabe: "6", Isa: "", Shane: "7", Bo: "7", Andrew: "-", Rachel: "" },
        average: 6.67,
        dateAdded: "2025-03-01T20:00:00.000Z"
    },
    {
        title: "Tropical Malady",
        picker: "Andrew",
        ratings: { Gabe: "9", Isa: "", Shane: "8", Bo: "8", Andrew: "9", Rachel: "" },
        average: 8.5,
        dateAdded: "2025-03-08T20:00:00.000Z"
    },
    {
        title: "Pray the Devil Back to Hell",
        picker: "Isa",
        ratings: { Gabe: "8", Isa: "", Shane: "7", Bo: "7", Andrew: "-", Rachel: "" },
        average: 7.33,
        dateAdded: "2025-03-15T20:00:00.000Z"
    },
    {
        title: "Wolfwalkers",
        picker: "Shane",
        ratings: { Gabe: "8", Isa: "", Shane: "8", Bo: "8", Andrew: "8", Rachel: "" },
        average: 8,
        dateAdded: "2025-03-22T20:00:00.000Z"
    },
    {
        title: "Incendies",
        picker: "Gabe",
        ratings: { Gabe: "8", Isa: "", Shane: "8", Bo: "8", Andrew: "", Rachel: "" },
        average: 8,
        dateAdded: "2025-03-29T20:00:00.000Z"
    },
    {
        title: "Point Blank",
        picker: "Bo",
        ratings: { Gabe: "6", Isa: "", Shane: "5", Bo: "8", Andrew: "", Rachel: "" },
        average: 6.33,
        dateAdded: "2025-04-05T20:00:00.000Z"
    },
    {
        title: "Paths of Glory",
        picker: "Andrew",
        ratings: { Gabe: "-", Isa: "", Shane: "7", Bo: "8", Andrew: "9", Rachel: "" },
        average: 8,
        dateAdded: "2025-04-12T20:00:00.000Z"
    },
    {
        title: "Sexy Beast",
        picker: "Shane",
        ratings: { Gabe: "9", Isa: "", Shane: "9", Bo: "9", Andrew: "9", Rachel: "" },
        average: 9,
        dateAdded: "2025-04-19T20:00:00.000Z"
    },
    {
        title: "A Tale of Summer",
        picker: "Gabe",
        ratings: { Gabe: "9", Isa: "", Shane: "8", Bo: "", Andrew: "8", Rachel: "" },
        average: 8.33,
        dateAdded: "2025-04-26T20:00:00.000Z"
    },
    {
        title: "Polyester",
        picker: "Bo",
        ratings: { Gabe: "6", Isa: "", Shane: "6", Bo: "6", Andrew: "", Rachel: "" },
        average: 6,
        dateAdded: "2025-05-03T20:00:00.000Z"
    },
    {
        title: "La Llorona",
        picker: "Andrew",
        ratings: { Gabe: "6", Isa: "", Shane: "7", Bo: "7", Andrew: "7", Rachel: "" },
        average: 6.75,
        dateAdded: "2025-05-10T20:00:00.000Z"
    },
    {
        title: "Johnny Guitar",
        picker: "Shane",
        ratings: { Gabe: "8", Isa: "", Shane: "7", Bo: "7", Andrew: "8", Rachel: "" },
        average: 7.5,
        dateAdded: "2025-05-17T20:00:00.000Z"
    },
    {
        title: "Harakiri",
        picker: "Gabe",
        ratings: { Gabe: "9", Isa: "8", Shane: "9", Bo: "9", Andrew: "9", Rachel: "" },
        average: 8.8,
        dateAdded: "2025-05-24T20:00:00.000Z"
    },
    {
        title: "Mirror",
        picker: "Bo",
        ratings: { Gabe: "9", Isa: "", Shane: "9", Bo: "9", Andrew: "", Rachel: "" },
        average: 9,
        dateAdded: "2025-05-31T20:00:00.000Z"
    },
    {
        title: "Hoop Dreams",
        picker: "Andrew",
        ratings: { Gabe: "9", Isa: "", Shane: "8", Bo: "8", Andrew: "9", Rachel: "" },
        average: 8.5,
        dateAdded: "2025-06-07T20:00:00.000Z"
    },
    {
        title: "The Draughtsman's Contract",
        picker: "Shane",
        ratings: { Gabe: "7", Isa: "", Shane: "8", Bo: "8", Andrew: "8", Rachel: "" },
        average: 7.75,
        dateAdded: "2025-06-14T20:00:00.000Z"
    },
    {
        title: "Hit the Road",
        picker: "Gabe",
        ratings: { Gabe: "8", Isa: "", Shane: "7", Bo: "7", Andrew: "", Rachel: "7" },
        average: 7.25,
        dateAdded: "2025-06-21T20:00:00.000Z"
    },
    {
        title: "The Boys Next Door",
        picker: "Rachel",
        ratings: { Gabe: "9", Isa: "", Shane: "6", Bo: "-", Andrew: "8", Rachel: "9" },
        average: 8,
        dateAdded: "2025-06-28T20:00:00.000Z"
    },
    {
        title: "Ace in the Hole",
        picker: "Bo",
        ratings: { Gabe: "8", Isa: "", Shane: "9", Bo: "9", Andrew: "", Rachel: "7" },
        average: 8.25,
        dateAdded: "2025-07-05T20:00:00.000Z"
    },
    {
        title: "Sweetie",
        picker: "Andrew",
        ratings: { Gabe: "8", Isa: "", Shane: "9", Bo: "8", Andrew: "8", Rachel: "" },
        average: 8.25,
        dateAdded: "2025-07-12T20:00:00.000Z"
    },
    {
        title: "Beau travail",
        picker: "Shane",
        ratings: { Gabe: "8", Isa: "", Shane: "8", Bo: "8", Andrew: "", Rachel: "10" },
        average: 8.5,
        dateAdded: "2025-07-19T20:00:00.000Z"
    },
    {
        title: "All About My Mother",
        picker: "Gabe",
        ratings: { Gabe: "8", Isa: "7", Shane: "7", Bo: "7", Andrew: "7", Rachel: "" },
        average: 7.2,
        dateAdded: "2025-07-26T20:00:00.000Z"
    },
    {
        title: "The Haunting",
        picker: "Rachel",
        ratings: { Gabe: "8", Isa: "", Shane: "8", Bo: "8", Andrew: "9", Rachel: "8" },
        average: 8.2,
        dateAdded: "2025-08-02T20:00:00.000Z"
    },
    {
        title: "X: The Man With the X-Ray Eyes",
        picker: "Bo",
        ratings: { Gabe: "8", Isa: "7", Shane: "5", Bo: "8", Andrew: "6", Rachel: "8" },
        average: 7,
        dateAdded: "2025-08-09T20:00:00.000Z"
    },
    {
        title: "Miller's Crossing",
        picker: "Andrew",
        ratings: { Gabe: "7", Isa: "", Shane: "9", Bo: "8", Andrew: "8", Rachel: "7" },
        average: 7.8,
        dateAdded: "2025-08-16T20:00:00.000Z"
    },
    {
        title: "Cries and Whispers",
        picker: "Shane",
        ratings: { Gabe: "10", Isa: "", Shane: "10", Bo: "10", Andrew: "9", Rachel: "10" },
        average: 9.8,
        dateAdded: "2025-08-23T20:00:00.000Z"
    },
    {
        title: "The Wild Robot",
        picker: "Gabe",
        ratings: { Gabe: "8", Isa: "", Shane: "7", Bo: "8", Andrew: "8", Rachel: "" },
        average: 7.75,
        dateAdded: "2025-08-30T20:00:00.000Z"
    },
    {
        title: "The Turin Horse",
        picker: "Rachel",
        ratings: { Gabe: "10", Isa: "", Shane: "9", Bo: "", Andrew: "9", Rachel: "9" },
        average: 9.25,
        dateAdded: "2025-09-06T20:00:00.000Z"
    },
    {
        title: "Leaving Las Vegas",
        picker: "Bo",
        ratings: { Gabe: "9", Isa: "", Shane: "8", Bo: "9", Andrew: "8", Rachel: "9" },
        average: 8.6,
        dateAdded: "2025-09-13T20:00:00.000Z"
    },
    {
        title: "Shoot the Piano Player",
        picker: "Andrew",
        ratings: { Gabe: "", Isa: "", Shane: "7", Bo: "", Andrew: "8", Rachel: "8" },
        average: 7.67,
        dateAdded: "2025-09-20T20:00:00.000Z"
    },
    {
        title: "Millennium Mambo",
        picker: "Shane",
        ratings: { Gabe: "", Isa: "", Shane: "7", Bo: "7", Andrew: "8", Rachel: "8" },
        average: 7.5,
        dateAdded: "2025-09-27T20:00:00.000Z"
    },
    {
        title: "Do Not Expect Too Much From The End Of The World",
        picker: "Gabe",
        ratings: { Gabe: "8", Isa: "", Shane: "6", Bo: "", Andrew: "", Rachel: "8" },
        average: 7.33,
        dateAdded: "2025-10-04T20:00:00.000Z"
    },
    {
        title: "A Swedish Love Story",
        picker: "Rachel",
        ratings: { Gabe: "7", Isa: "", Shane: "8", Bo: "", Andrew: "9", Rachel: "10" },
        average: 8.5,
        dateAdded: "2025-10-11T20:00:00.000Z"
    },
    {
        title: "Ghost in the Shell",
        picker: "Bo",
        ratings: { Gabe: "10", Isa: "", Shane: "9", Bo: "9", Andrew: "9", Rachel: "" },
        average: 9.25,
        dateAdded: "2025-10-18T20:00:00.000Z"
    },
    {
        title: "Killers of Sheep",
        picker: "Andrew",
        ratings: { Gabe: "10", Isa: "", Shane: "10", Bo: "10", Andrew: "10", Rachel: "" },
        average: 10,
        dateAdded: "2025-10-25T20:00:00.000Z"
    },
    {
        title: "The Red Shoes",
        picker: "Shane",
        ratings: { Gabe: "9", Isa: "", Shane: "9", Bo: "9", Andrew: "9", Rachel: "9" },
        average: 9,
        dateAdded: "2025-11-01T20:00:00.000Z"
    },
    {
        title: "Tape",
        picker: "Gabe",
        ratings: { Gabe: "9", Isa: "", Shane: "8", Bo: "8", Andrew: "8", Rachel: "8" },
        average: 8.2,
        dateAdded: "2025-11-08T20:00:00.000Z"
    },
    {
        title: "The Old Man & The Gun",
        picker: "Rachel",
        ratings: { Gabe: "8", Isa: "", Shane: "7", Bo: "7", Andrew: "", Rachel: "7" },
        average: 7.25,
        dateAdded: "2025-11-15T20:00:00.000Z"
    },
    {
        title: "Dial M for Murder",
        picker: "Bo",
        ratings: { Gabe: "7", Isa: "", Shane: "8", Bo: "8", Andrew: "8", Rachel: "" },
        average: 7.75,
        dateAdded: "2025-11-22T20:00:00.000Z"
    },
    {
        title: "Jonathan",
        picker: "Andrew",
        ratings: { Gabe: "7", Isa: "", Shane: "6", Bo: "", Andrew: "7", Rachel: "" },
        average: 6.67,
        dateAdded: "2025-11-29T20:00:00.000Z"
    },
    {
        title: "L'Argent",
        picker: "Shane",
        ratings: { Gabe: "7", Isa: "", Shane: "8", Bo: "8", Andrew: "9", Rachel: "8" },
        average: 8,
        dateAdded: "2025-12-06T20:00:00.000Z"
    },
    {
        title: "Perfect Blue",
        picker: "Gabe",
        ratings: { Gabe: "9", Isa: "", Shane: "8", Bo: "9", Andrew: "8", Rachel: "" },
        average: 8.5,
        dateAdded: "2025-12-13T20:00:00.000Z"
    },
    {
        title: "The Exterminating Angel",
        picker: "Rachel",
        ratings: { Gabe: "10", Isa: "", Shane: "9", Bo: "9", Andrew: "", Rachel: "9" },
        average: 9.25,
        dateAdded: "2025-12-20T20:00:00.000Z"
    },
    {
        title: "Kaili Blues",
        picker: "Andrew",
        ratings: { Gabe: "9", Isa: "", Shane: "9", Bo: "", Andrew: "10", Rachel: "" },
        average: 9.33,
        dateAdded: "2026-02-16T20:00:00.000Z"
    }
];


