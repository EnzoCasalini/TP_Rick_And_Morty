import {
    IonBackButton,
    IonButtons, IonCol,
    IonContent,
    IonGrid,
    IonHeader, IonImg, IonItem, IonLabel,
    IonPage, IonRow, IonText,
    IonTitle,
    IonToolbar,
    useIonViewWillEnter
} from "@ionic/react";
import {RouteComponentProps} from "react-router";
import React, {useState} from "react";
import {Episodes} from "../api/responses/Episodes";
import {Character} from "../api/responses/Character";

interface DetailsPageProps extends RouteComponentProps<{ id: string; }> {
}

const Details: React.FC<DetailsPageProps> = ({match}) => {

    /* ------------------------ Un peu de CSS ------------------------ */

    const textStyle = {
        fontWeight: "bold",
        fontSize: "20px",
        marginLeft: "20px"
    };

    const descriptionText = {
        fontWeight: "bold",
        fontSize: "20px",
    };

    const text = {
        fontWeight: "normal",
        fontSize: "18px",
    };

    /* --------------------------------------------------------------- */


    const [episode, setEpisode] = useState<Episodes>();
    const [characters, setCharacters] = useState<Character[]>([]); // On fait un tableau de Character pour pouvoir récupérer plusieurs personnages à la fois.


    // Méthode qui permet de récupérer l'épisode correspondant à l'id dans l'url.
    async function GetEpisode(id:string) {
        let temp: string[] = [];
        let i = 0;

        try {
            const response = await fetch(`https://rickandmortyapi.com/api/episode/${id}`);
            const data = await response.json() as Episodes; // On récupère les infos de l'API.

            setEpisode(data); // On set les infos de l'épisode dans notre state.

            // On vérifie si data.characters est undefined. S'il ne l'est pas, on va stocker dans un tableau tous les ids des personnages présents dans l'épisode.
            // On slice avec le / pour récupérer seulement l'id qui se trouve derrière le dernier / .
            if (data.characters != undefined) {
                data.characters?.map((charUrl) => {
                    let test = charUrl.split('/');
                    temp[i] = test[test.length - 1];
                    i++;
                })
                return `https://rickandmortyapi.com/api/character/${temp}`; // On renvoie l'url avec le tableau d'id afin de récupérer plusieurs personnages, comme montré dans la doc de l'API.
            }
        }
        catch (e) {
            console.error(e);
        }
    }


    // Méthode pour récupérer les personnages depuis l'API.
    async function GetCharacters(url:string) {
        try {
            // On va chercher dans l'API grâce à l'URL (qui contient tous les ids des personnages).
            const responseChar = await fetch(url);
            const dataChar = await responseChar.json();

            setCharacters(dataChar); // On met les infos dans notre state "characters".
        }
        catch (e) {
            console.error(e);
        }
        // console.log("characters : " + characters);
    }

    // Dès qu'on rentre sur la page détails, on appelle les méthodes GetEpisode et GetCharacters.
    useIonViewWillEnter(async () => {
        let test = await GetEpisode(match.params.id);
        //console.log("test : " + test);
        await GetCharacters(test as string);
    });

    return (
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonButtons slot={"start"}>
                        <IonBackButton defaultHref={"/"} text={"Back"}/>
                    </IonButtons>
                    <IonTitle class={"ion-text-center"}>
                        {episode?.episode} - {episode?.name}
                    </IonTitle>
                </IonToolbar>
            </IonHeader>
            <IonContent>
                {/* On affiche les deux premiers sous-titres. */ }
                <h4 style={textStyle}>Date de sortie : <IonText style={text}>{episode?.air_date}</IonText></h4>
                <h4 style={textStyle}>Personnages : </h4>
                <IonGrid>
                    {/* Pour chaque personnage, on crée une ligne avec deux colonnes, la première colonne contient seulement l'image du personnage que l'on récupère grâce à son url.
                        La seconde colonne, elle, contient certaines informations du personnage : nom, statut, espèce, genre. */ }
                    {characters.map((character: Character) => {
                        return (
                            <>
                            <IonRow>
                                <IonCol>
                                    <IonImg src={character.image}/>
                                </IonCol>
                                <IonCol size={"6"}>
                                    <h4 style={descriptionText}>{character.name}</h4>
                                    <h4 style={descriptionText}>Status : <IonText style={text}>{character.status}</IonText></h4>
                                    <h4 style={descriptionText}>Species : <IonText style={text}>{character.species}</IonText></h4>
                                    <h4 style={descriptionText}>Gender : <IonText style={text}>{character.gender}</IonText></h4>
                                </IonCol>
                            </IonRow>
                            </>
                    )})}
                </IonGrid>
            </IonContent>
        </IonPage>
    );
}

export default Details;
































// Pour demain :
// En gros, là je pense à mettre dans un tableau tous les ids des personnages de l'épisode.
// Une fois que j'aurai les ids, j'irai chercher dans l'API les personnages en faisant une requête multiple.