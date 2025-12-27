const movies = [
    {
        title: "Ratcatcher",
        picker: "Shane",
        ratings: { Gabe: "8", Isa: "7", Shane: "9", Bo: "8", Andrew: "-", Rachel: "" },
        average: 8
    },
    {
        title: "Burning",
        picker: "Gabe",
        ratings: { Gabe: "7", Isa: "8", Shane: "6", Bo: "7", Andrew: "9", Rachel: "" },
        average: 7.4
    },
    {
        title: "The Long Goodbye",
        picker: "Bo",
        ratings: { Gabe: "7", Isa: "6", Shane: "8", Bo: "9", Andrew: "9", Rachel: "" },
        average: 7.8
    },
    {
        title: "Volver",
        picker: "Isa",
        ratings: { Gabe: "10", Isa: "9", Shane: "8", Bo: "9", Andrew: "High 9", Rachel: "" },
        average: 9
    },
    {
        title: "A Hero",
        picker: "Andrew",
        ratings: { Gabe: "7", Isa: "8", Shane: "9", Bo: "8", Andrew: "8", Rachel: "" },
        average: 8
    },
    {
        title: "Far From Heaven",
        picker: "Shane",
        ratings: { Gabe: "6", Isa: "6", Shane: "6", Bo: "6", Andrew: "-", Rachel: "" },
        average: 6
    },
    {
        title: "Cold War",
        picker: "Gabe",
        ratings: { Gabe: "8", Isa: "7", Shane: "7", Bo: "7", Andrew: "8", Rachel: "" },
        average: 7.4
    },
    {
        title: "Blowup",
        picker: "Bo",
        ratings: { Gabe: "7", Isa: "7", Shane: "7", Bo: "8", Andrew: "9", Rachel: "" },
        average: 7.6
    },
    {
        title: "The Second Mother",
        picker: "Isa",
        ratings: { Gabe: "8", Isa: "9", Shane: "8", Bo: "8", Andrew: "-", Rachel: "" },
        average: 8.25
    },
    {
        title: "Certain Women",
        picker: "Shane",
        ratings: { Gabe: "6", Isa: "8", Shane: "7", Bo: "7", Andrew: "-", Rachel: "" },
        average: 7
    },
    {
        title: "Woman In The Dunes",
        picker: "Gabe",
        ratings: { Gabe: "10", Isa: "9", Shane: "9", Bo: "9", Andrew: "-", Rachel: "" },
        average: 9.25
    },
    {
        title: "The Manchurian Candidate",
        picker: "Bo",
        ratings: { Gabe: "7", Isa: "7", Shane: "5", Bo: "7", Andrew: "-", Rachel: "" },
        average: 6.5
    },
    {
        title: "Saturday Night Fever",
        picker: "Isa",
        ratings: { Gabe: "8", Isa: "8", Shane: "6", Bo: "6", Andrew: "-", Rachel: "" },
        average: 7
    },
    {
        title: "Sans Soleil",
        picker: "Shane",
        ratings: { Gabe: "6", Isa: "", Shane: "8", Bo: "8", Andrew: "-", Rachel: "" },
        average: 7.33
    },
    {
        title: "Barton Fink",
        picker: "Gabe",
        ratings: { Gabe: "10", Isa: "7", Shane: "10", Bo: "8", Andrew: "9", Rachel: "" },
        average: 8.8
    },
    {
        title: "Body Double",
        picker: "Bo",
        ratings: { Gabe: "7", Isa: "", Shane: "7", Bo: "8", Andrew: "-", Rachel: "" },
        average: 7.33
    },
    {
        title: "Mulholland Dr",
        picker: "Andrew",
        ratings: { Gabe: "8", Isa: "", Shane: "9", Bo: "10", Andrew: "9", Rachel: "" },
        average: 9
    },
    {
        title: "The Witch",
        picker: "Isa",
        ratings: { Gabe: "8", Isa: "", Shane: "9", Bo: "7", Andrew: "8", Rachel: "" },
        average: 8
    },
    {
        title: "Black Girl",
        picker: "Shane",
        ratings: { Gabe: "7", Isa: "", Shane: "8", Bo: "8", Andrew: "8", Rachel: "" },
        average: 7.75
    },
    {
        title: "Amadeus",
        picker: "Gabe",
        ratings: { Gabe: "9", Isa: "", Shane: "9", Bo: "8", Andrew: "7", Rachel: "" },
        average: 8.25
    },
    {
        title: "Pather Panchali",
        picker: "Bo",
        ratings: { Gabe: "9", Isa: "", Shane: "8", Bo: "8", Andrew: "-", Rachel: "" },
        average: 8.33
    },
    {
        title: "Serpico",
        picker: "Andrew",
        ratings: { Gabe: "7", Isa: "", Shane: "7", Bo: "8", Andrew: "9", Rachel: "" },
        average: 7.75
    },
    {
        title: "Wall Street",
        picker: "Isa",
        ratings: { Gabe: "7", Isa: "", Shane: "4", Bo: "5", Andrew: "7", Rachel: "" },
        average: 5.75
    },
    {
        title: "Minding the Gap",
        picker: "Shane",
        ratings: { Gabe: "10", Isa: "", Shane: "8", Bo: "8", Andrew: "10", Rachel: "" },
        average: 9
    },
    {
        title: "The Face of Another",
        picker: "Gabe",
        ratings: { Gabe: "8", Isa: "", Shane: "7", Bo: "8", Andrew: "8", Rachel: "" },
        average: 7.75
    },
    {
        title: "To Sleep with Anger",
        picker: "Bo",
        ratings: { Gabe: "6", Isa: "", Shane: "7", Bo: "7", Andrew: "-", Rachel: "" },
        average: 6.67
    },
    {
        title: "Tropical Malady",
        picker: "Andrew",
        ratings: { Gabe: "9", Isa: "", Shane: "8", Bo: "8", Andrew: "9", Rachel: "" },
        average: 8.5
    },
    {
        title: "Pray the Devil Back to Hell",
        picker: "Isa",
        ratings: { Gabe: "8", Isa: "", Shane: "7", Bo: "7", Andrew: "-", Rachel: "" },
        average: 7.33
    },
    {
        title: "Wolfwalkers",
        picker: "Shane",
        ratings: { Gabe: "8", Isa: "", Shane: "8", Bo: "8", Andrew: "8", Rachel: "" },
        average: 8
    },
    {
        title: "Incendies",
        picker: "Gabe",
        ratings: { Gabe: "8", Isa: "", Shane: "8", Bo: "8", Andrew: "", Rachel: "" },
        average: 8
    },
    {
        title: "Point Blank",
        picker: "Bo",
        ratings: { Gabe: "6", Isa: "", Shane: "5", Bo: "8", Andrew: "", Rachel: "" },
        average: 6.33
    },
    {
        title: "Paths of Glory",
        picker: "Andrew",
        ratings: { Gabe: "-", Isa: "", Shane: "7", Bo: "8", Andrew: "9", Rachel: "" },
        average: 8
    },
    {
        title: "Sexy Beast",
        picker: "Shane",
        ratings: { Gabe: "9", Isa: "", Shane: "9", Bo: "9", Andrew: "9", Rachel: "" },
        average: 9
    },
    {
        title: "A Tale of Summer",
        picker: "Gabe",
        ratings: { Gabe: "9", Isa: "", Shane: "8", Bo: "", Andrew: "8", Rachel: "" },
        average: 8.33
    },
    {
        title: "Polyester",
        picker: "Bo",
        ratings: { Gabe: "6", Isa: "", Shane: "6", Bo: "6", Andrew: "", Rachel: "" },
        average: 6
    },
    {
        title: "La Llorona",
        picker: "Andrew",
        ratings: { Gabe: "6", Isa: "", Shane: "7", Bo: "7", Andrew: "7", Rachel: "" },
        average: 6.75
    },
    {
        title: "Johnny Guitar",
        picker: "Shane",
        ratings: { Gabe: "8", Isa: "", Shane: "7", Bo: "7", Andrew: "8", Rachel: "" },
        average: 7.5
    },
    {
        title: "Harakiri",
        picker: "Gabe",
        ratings: { Gabe: "9", Isa: "8", Shane: "9", Bo: "9", Andrew: "9", Rachel: "" },
        average: 8.8
    },
    {
        title: "Mirror",
        picker: "Bo",
        ratings: { Gabe: "9", Isa: "", Shane: "9", Bo: "9", Andrew: "", Rachel: "" },
        average: 9
    },
    {
        title: "Hoop Dreams",
        picker: "Andrew",
        ratings: { Gabe: "9", Isa: "", Shane: "8", Bo: "8", Andrew: "9", Rachel: "" },
        average: 8.5
    },
    {
        title: "The Draughtsman's Contract",
        picker: "Shane",
        ratings: { Gabe: "7", Isa: "", Shane: "8", Bo: "8", Andrew: "8", Rachel: "" },
        average: 7.75
    },
    {
        title: "Hit the Road",
        picker: "Gabe",
        ratings: { Gabe: "8", Isa: "", Shane: "7", Bo: "7", Andrew: "", Rachel: "7" },
        average: 7.25
    },
    {
        title: "The Boys Next Door",
        picker: "Rachel",
        ratings: { Gabe: "9", Isa: "", Shane: "6", Bo: "-", Andrew: "8", Rachel: "9" },
        average: 8
    },
    {
        title: "Ace in the Hole",
        picker: "Bo",
        ratings: { Gabe: "8", Isa: "", Shane: "9", Bo: "9", Andrew: "", Rachel: "7" },
        average: 8.25
    },
    {
        title: "Sweetie",
        picker: "Andrew",
        ratings: { Gabe: "8", Isa: "", Shane: "9", Bo: "8", Andrew: "8", Rachel: "" },
        average: 8.25
    },
    {
        title: "Beau travail",
        picker: "Shane",
        ratings: { Gabe: "8", Isa: "", Shane: "8", Bo: "8", Andrew: "", Rachel: "10" },
        average: 8.5
    },
    {
        title: "All About My Mother",
        picker: "Gabe",
        ratings: { Gabe: "8", Isa: "7", Shane: "7", Bo: "7", Andrew: "7", Rachel: "" },
        average: 7.2
    },
    {
        title: "The Haunting",
        picker: "Rachel",
        ratings: { Gabe: "8", Isa: "", Shane: "8", Bo: "8", Andrew: "9", Rachel: "8" },
        average: 8.2
    },
    {
        title: "X: The Man With the X-Ray Eyes",
        picker: "Bo",
        ratings: { Gabe: "8", Isa: "7", Shane: "5", Bo: "8", Andrew: "6", Rachel: "8" },
        average: 7
    },
    {
        title: "Miller's Crossing",
        picker: "Andrew",
        ratings: { Gabe: "7", Isa: "", Shane: "9", Bo: "8", Andrew: "8", Rachel: "7" },
        average: 7.8
    },
    {
        title: "Cries and Whispers",
        picker: "Shane",
        ratings: { Gabe: "10", Isa: "", Shane: "10", Bo: "10", Andrew: "9", Rachel: "10" },
        average: 9.8
    },
    {
        title: "The Wild Robot",
        picker: "Gabe",
        ratings: { Gabe: "8", Isa: "", Shane: "7", Bo: "8", Andrew: "8", Rachel: "" },
        average: 7.75
    },
    {
        title: "The Turin Horse",
        picker: "Rachel",
        ratings: { Gabe: "10", Isa: "", Shane: "9", Bo: "", Andrew: "9", Rachel: "9" },
        average: 9.25
    },
    {
        title: "Leaving Las Vegas",
        picker: "Bo",
        ratings: { Gabe: "9", Isa: "", Shane: "8", Bo: "9", Andrew: "8", Rachel: "9" },
        average: 8.6
    },
    {
        title: "Shoot the Piano Player",
        picker: "Andrew",
        ratings: { Gabe: "", Isa: "", Shane: "7", Bo: "", Andrew: "8", Rachel: "8" },
        average: 7.67
    },
    {
        title: "Millennium Mambo",
        picker: "Shane",
        ratings: { Gabe: "", Isa: "", Shane: "7", Bo: "7", Andrew: "8", Rachel: "8" },
        average: 7.5
    },
    {
        title: "Do Not Expect Too Much From The End Of The World",
        picker: "Gabe",
        ratings: { Gabe: "8", Isa: "", Shane: "6", Bo: "", Andrew: "", Rachel: "8" },
        average: 7.33
    },
    {
        title: "A Swedish Love Story",
        picker: "Rachel",
        ratings: { Gabe: "7", Isa: "", Shane: "8", Bo: "", Andrew: "9", Rachel: "10" },
        average: 8.5
    },
    {
        title: "Ghost in the Shell",
        picker: "Bo",
        ratings: { Gabe: "10", Isa: "", Shane: "9", Bo: "9", Andrew: "9", Rachel: "" },
        average: 9.25
    },
    {
        title: "Killers of Sheep",
        picker: "Andrew",
        ratings: { Gabe: "10", Isa: "", Shane: "10", Bo: "10", Andrew: "10", Rachel: "" },
        average: 10
    },
    {
        title: "The Red Shoes",
        picker: "Shane",
        ratings: { Gabe: "9", Isa: "", Shane: "9", Bo: "9", Andrew: "9", Rachel: "9" },
        average: 9
    },
    {
        title: "Tape",
        picker: "Gabe",
        ratings: { Gabe: "9", Isa: "", Shane: "8", Bo: "8", Andrew: "8", Rachel: "8" },
        average: 8.2
    },
    {
        title: "The Old Man & The Gun",
        picker: "Rachel",
        ratings: { Gabe: "8", Isa: "", Shane: "7", Bo: "7", Andrew: "", Rachel: "7" },
        average: 7.25
    },
    {
        title: "Dial M for Murder",
        picker: "Bo",
        ratings: { Gabe: "7", Isa: "", Shane: "8", Bo: "8", Andrew: "8", Rachel: "" },
        average: 7.75
    },
    {
        title: "Jonathan",
        picker: "Andrew",
        ratings: { Gabe: "7", Isa: "", Shane: "6", Bo: "", Andrew: "7", Rachel: "" },
        average: 6.67
    },
    {
        title: "L'Argent",
        picker: "Shane",
        ratings: { Gabe: "7", Isa: "", Shane: "8", Bo: "8", Andrew: "9", Rachel: "8" },
        average: 8
    },
    {
        title: "Perfect Blue",
        picker: "Gabe",
        ratings: { Gabe: "9", Isa: "", Shane: "8", Bo: "9", Andrew: "8", Rachel: "" },
        average: 8.5
    },
    {
        title: "The Exterminating Angel",
        picker: "Rachel",
        ratings: { Gabe: "10", Isa: "", Shane: "9", Bo: "9", Andrew: "", Rachel: "9" },
        average: 9.25
    }
];


