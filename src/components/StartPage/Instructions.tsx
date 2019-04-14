import React, {FunctionComponent} from 'react';
import firebase from '../../config/firebase';

const Instructions: FunctionComponent<IInstructionsProps> = ({userDetails}) => {
  return (<div>
    <h4>Riktigt roligt att du hittat hit, {userDetails && userDetails.displayName}!</h4>

    Denna applikation är utformad för att ge dig ett enkelt gränssnitt för att göra en sak enkelt: Att lägga till dina olika träningsövningar.

    <div className="mt-1">
      <blockquote className="blockquote">Dessa 3 punkter behöver du veta:</blockquote>
      <ol>
        <li>Du lägger till en ny dag för att lägga till övningar</li>
        <li>En dag består av en, eller flera, övningar</li>
        <li>Det finns två olika övningstyper du kan välja mellan</li>
      </ol>
      Sådär. Inget mer, inget mindre. Hoppas det inte låter alltför krångligt <span role="img" aria-label="" aria-labelledby="">😉</span>
    </div>

    <blockquote className="blockquote">Fortsätt läsa om detta är din första gång som du använder applikationen för att få bättre förståelse hur du använder den.</blockquote>

    <h5>En dag</h5>
    <ul>
      <li>Består av en </li>
      <li>En timer startas automatiskt</li>
    </ul>

    <h5>En övning</h5>
    <ul>
      <li>Namn, oftast vad övningen heter (<small>t.ex. bänkpress</small>)</li>
      <li>Typ</li>
    </ul>

    En övning har ett namn, vilket oftas är den specifika övningen man gör, och är en av två typer.
    "Set med repetitioner och vikt" och "Flås"
    Om man väljer "sets and reps" kommer man få upp en vy där man skriver in sina repetitioner och vikt.
  </div>);
};

interface IInstructionsProps {
  userDetails: firebase.User | undefined
}

export default Instructions;