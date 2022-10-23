import React, { useEffect, useState } from 'react';
import axios, { AxiosResponse } from 'axios';
import { id, secret } from './client';
import Footer from './footer';
import Song from './song';
import Header from './header';
import LeftBar from './left-bar';
import Mix from './mix';
import { IContent, ISong } from './interfaces'
import { Section } from './section';

function App() {
  const [token, setToken] = useState('');
  const [albums, setAlbums] = useState<IContent[]>([]);
  const [artists, setArtists] = useState<IContent[]>([]);
  const [nextAlbums, setNextAlbums] = useState<IContent[]>([]);
  const [recentlySongs, setRecentlySongs] = useState<ISong[]>([]);
  const [songs, setSongs] = useState<ISong[]>([]);

  useEffect(() => {
    const data = new URLSearchParams();
    data.append('grant_type', 'client_credentials');
    const headers = {
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization: 'Basic ' + btoa(id + ':' + secret),
    };
    axios
      .post('https://accounts.spotify.com/api/token', data, {
        headers: headers,
      })
      .then((response) => {
        setToken(response.data.access_token);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  function useRequest(url: string, action: (value: AxiosResponse<any, any>) => void) {
    useEffect(() => {
      axios
        .get(url, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + token,
          },
        })
        .then(action)
        .catch((error) => {
          console.log(error);
        });
    }, [token]);
  }

  useRequest(
    "https://api.spotify.com/v1/tracks?ids=2WZnbS1syZNQToMyoTo8sl,2m3PVx1gsVB5upxi94IW8I," +
    "6UKgQ1F3srVR2sB8KCjl2z,2fP2RBX81C55kEBaHZHomY,14JceK2UBLd0UUm23N5lRy,5BFADKJgtL2eZ4XZJq8zEc",
    response => setSongs(response.data.tracks)
  );

  useRequest(
    "https://api.spotify.com/v1/albums?ids=4OePhJbXIRLGvbFe8I7h7z,2Hjo1gR2ceHxCwrPyg7J4Q," +
    "13I0rh31e7y0WBE3mDTaoR,2gH6dxvxcQfeX7aqFn5HOh",
    response => setAlbums(response.data.albums)
  );

  useRequest(
    "https://api.spotify.com/v1/artists/5meD8C7oGK5yUEY2T7ZZ7W/albums?limit=7",
    response => setArtists(response.data.items)
  );

  useRequest(
    "https://api.spotify.com/v1/tracks?ids=0LYYnnXoORfx9ldA3vBPzg,7K0YWcVSyaMN4TaLw2Icd4,6Abmb1Nh7Bc5U6o4iEgSDH",
    response => setRecentlySongs(response.data.tracks)
  );

  useRequest(
    "https://api.spotify.com/v1/albums?ids=4ktDOYU0Jual1ELFTPhFd6,33d5rgoaT9kdzGxVyOG4X8,0KI2FFbkTty1Qv9Ifb6R9o",
    response => setNextAlbums(response.data.albums)
  );

  return (
    <div className="App">
      <Header />
      <LeftBar />
      <main className="content">
        <div className="music">
          {token ? (
            <>
              <h1>Привет!</h1>
              <Section
                headerText=""
                sectionId="songs"
                content={songs.map(({ id, name, album }) => {
                  return <Song key={id} image={album.images[0].url} name={name} />;
                })}
                sectionClass="songs"
              />
              <Section
                headerText="Индивидуальная подборка"
                sectionId="albums"
                content={albums.map(({ id, name, images, artists }) => {
                  return <Mix key={id} image={images[0].url} name={name} desc={artists[0].name} />;
                })}
                sectionClass="mixes"
              />
              <Section
                headerText="Слушал недавно"
                sectionId="recentlyListen"
                content={recentlySongs.map(({ id, name, artists, album }) => {
                  return <Mix key={id} image={album.images[0].url} name={name} desc={artists[0].name} />;
                })}
                sectionClass="mixes"
              />
              <Section
                headerText="Наиболее прослушиваемые альбомы"
                sectionId="next"
                content={nextAlbums.map(({ id, name, images, artists }) => {
                  return <Mix key={id} image={images[0].url} name={name} desc={artists[0].name} />;
                })}
                sectionClass="mixes"
                underHeader="Подборки хитов по исполнителям."
              />
              <Section
                headerText="Из избранного"
                sectionId="artist"
                content={artists.map(({ id, name, artists, images }) => {
                  return <Mix key={id} image={images[0].url} name={name} desc={artists[0].name} />;
                })}
                sectionClass="mixes"
              />
            </>
          ) : (
            <div>Sorry</div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default App;