import { PersonaInitialsColor } from "@fluentui/react";
let possibleColors = [PersonaInitialsColor.blue, PersonaInitialsColor.burgundy,
PersonaInitialsColor.cyan, PersonaInitialsColor.darkBlue, PersonaInitialsColor.darkGreen,
PersonaInitialsColor.darkRed, PersonaInitialsColor.rust, PersonaInitialsColor.purple,
PersonaInitialsColor.magenta, PersonaInitialsColor.teal, PersonaInitialsColor.violet
];
export const getRandomColor = () => {
    let length = possibleColors.length;
    let randomIndex:number = Math.floor(Math.random()*length);
    return possibleColors[randomIndex];
}