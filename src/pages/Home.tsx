import {
    IonContent,
    IonHeader, IonInfiniteScroll, IonInfiniteScrollContent, IonItem,
    IonLabel,
    IonList,
    IonPage,
    IonSearchbar, IonText,
    IonToolbar,
    useIonViewWillEnter, withIonLifeCycle
} from '@ionic/react';

import './Home.css';
import React, {useState} from "react";
import {RickAndMortyAPI} from "../api/results/RickAndMortyAPI";

const Home: React.FC = () => {

    /* ------------------------ Un peu de CSS ------------------------ */

    const error = {
        display: "flex",
        justifyContent: "center",
        marginTop: "10px",
        fontSize: "20px",
        fontWeight: "bold"
    };

    /* --------------------------------------------------------------- */


    const [searchText, setSearchText] = useState('');
    const [episodes, setEpisodes] = useState<RickAndMortyAPI>({results: []})
    const [isInfiniteDisabled, setIsInfiniteDisabled] = useState<boolean>(false);


    // Méthode pour filtrer les épisodes avec la barre de recherche.
    async function SearchEpisodes(name:string) {
        try {
            setIsInfiniteDisabled(true);

            setSearchText(name); // On écrit dans la barre de recherche.

            let url = `https://rickandmortyapi.com/api/episode/?name=${name}`; // On va chercher les épisodes qui contiennent la valeur de "name" dans l'API.
            let response = await fetch(url);
            let data = await response.json() as RickAndMortyAPI; // On stocke la réponse du serveur dans data.
            //console.log(data);

            if (data.results == null) // Ce cas arrive quand on supprime ce qu'il y a écrit dans la barre de recherche.
            {
                setEpisodes({
                    info: data.info,
                    results: [{name: "No matches found"}]
                })
            }
            else { // Si data a des informations, on les met dans notre state "episodes".
                setEpisodes({
                    info: data.info,
                    results: data.results
                });
            }

            setIsInfiniteDisabled(false);
        }
        catch (e) {
            console.error(e);
        }
    }

    // Méthode pour récupérer tous les épisodes dans l'API.
    async function GetEpisodes(next:string) {
        try {
            setIsInfiniteDisabled(true);

            let response = await fetch(next); // On cherche les épisodes à l'aide de l'url. (Soit celle de base, soit la next).
            let data = await response.json() as RickAndMortyAPI;
            //console.log(data);

            // On met les infos récupérées par data dans notre state "episodes".
            setEpisodes({
                info: data.info,
                results : [...episodes.results, ...data.results]
            });

            setIsInfiniteDisabled(false);
        }
        catch (e) {
            console.error(e);
        }
    }

    //console.log(episodes.info)
    // Quand on lance l'appli, on appelle la fonction GetEpisodes de manière à ce que les 20 premiers épisodes apparaissent.
    useIonViewWillEnter(async () => await GetEpisodes('https://rickandmortyapi.com/api/episode/'))


  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
            {/* On appelle la fonction SearchEpisodes dès qu'il y a une modification de la SearchBar.*/ }
            <IonSearchbar value={searchText} onIonChange={async (e) => await SearchEpisodes(e.detail.value!)} animated/>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
          <IonList>
              {/* Ici, on affiche le nom, l'épisode et la date de parution de l'épisode. On renseigne également le routerlink qui permettra la navigation sur la page détails. */ }
              {episodes.results.map(value => {
                  if (value.name != "No matches found") {
                      return (
                      <IonItem routerLink={"details/" + value.id}>
                          <IonLabel>
                              {value.name} <br/>
                              <IonText color={"medium"}>
                                  {value.episode} - {value.air_date}
                              </IonText>
                          </IonLabel>
                      </IonItem>
                      )
                  }
                  else
                  {
                      return (
                          <IonLabel style={error}>
                              {value.name} <br/>
                          </IonLabel>
                      )
                  }
              })}
          </IonList>
          {/* On active le scroll infini. */ }
          <IonInfiniteScroll
              onIonInfinite={async () => await GetEpisodes(episodes.info?.next as string)}
              threshold="100px"
              disabled={isInfiniteDisabled}
          >
              <IonInfiniteScrollContent
                  loadingSpinner="bubbles"
                  loadingText="Loading more data..."
              />
          </IonInfiniteScroll>
      </IonContent>
    </IonPage>
  );
};

export default withIonLifeCycle(Home);
