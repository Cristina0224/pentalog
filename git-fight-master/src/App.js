import React, { useState } from "react";
import "./App.css";
import UserInputForm from "./UserInputForm";
import {
  fetchUserData,
  fetchUserRepositories,
  fetchRepositoryCommits,
} from "./GitHubAPI";
import { useEffect } from "react";

const CLIENT_ID = "242c7c0716f9cf558c23";

function App() {
  // Definirea stării pentru datele utilizatorului 1, datele utilizatorului 2, repository-urile utilizatorului 1 și repository-urile utilizatorului 2
  const [userData1, setUserData1] = useState(null);
  const [userData2, setUserData2] = useState(null);
  const [userRepos1, setUserRepos1] = useState([]);
  const [userRepos2, setUserRepos2] = useState([]);
  const [error, setError] = useState(null);
  const currentDate = new Date();
  const threeMonthsAgo = new Date(currentDate);
  threeMonthsAgo.setMonth(currentDate.getMonth() - 3);

  // Funcție pentru a căuta informații despre un utilizator GitHub și a afișa repository-urile și numărul de commit-uri
  async function searchUserInfo(username, setUserFunc, setReposFunc) {
    try {
      // Obținerea datelor utilizatorului
      const user = await fetchUserData(username);
      // Obținerea repository-urilor utilizatorului
      const repos = await fetchUserRepositories(username);

      // Actualizarea stării cu datele utilizatorului și repository-urile
      setUserFunc(user);

      // Calcularea numărului de commit-uri pentru fiecare repository în ultimele 3 luni
      const repoCommitsPromises = repos.map(async (repo) => {
        const commits = await fetchRepositoryCommits(username, repo.name);
        const recentCommits = commits.filter((commit) => {
          const commitDate = new Date(commit.commit.author.date);
          return commitDate >= threeMonthsAgo;
        });
        return { ...repo, recentCommits: recentCommits.length };
      });

      const reposWithCommits = await Promise.all(repoCommitsPromises);
      setReposFunc(reposWithCommits);

      setError(null); // Resetarea mesajelor de eroare
    } catch (error) {
      console.error("Eroare la căutarea utilizatorului:", error);
      setError(
        "Eroare la căutarea utilizatorului. Verificați numele de utilizator și încercați din nou."
      );
    }
  }

  // Funcție pentru a căuta utilizatori GitHub
  async function onSearchFunction(username1, username2) {
    setError(null); // Resetarea mesajelor de eroare înainte de căutare

    // Apelarea funcției searchUserInfo pentru primul și al doilea utilizator
    await searchUserInfo(username1, setUserData1, setUserRepos1);
    await searchUserInfo(username2, setUserData2, setUserRepos2);
  }

////////////////////////////////////////////////////////////
 const [rerender,setRerender] = useState(false);
 const [userData, setUserData] = useState({});

useEffect(() => {
  // http://localhost:3000/?code=d82174e41781333c6a3c
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  const codeParam = urlParams.get("code");
  console.log(codeParam);

  if (codeParam && (localStorage.getItem("accessToken") === null)) {
    async function getAccessToken() {
      await fetch("http://localhost:4000/getAccessToken?code="+codeParam,{
        method:"GET",
      }).then((response) =>{
        return response.json();
      }).then((data)=>{
        console.log(data);
        if(data.access_token){
          localStorage.setItem("accessToken", data.access_token);
          setRerender(!rerender);
        } 
      });
    }
    
    getAccessToken();
  }
}, [rerender]);

async function getUserData() {
  await fetch("http://localhost:4000/getUserData",{
    method:"GET",
    headers: {
      "Authorization": "Bearer " + localStorage.getItem("accessToken")
    }
    
  }).then((response)=>{
    return response.json();
  }).then((data)=>{
    console.log(data);
    setUserData(data);
  })
}

  function loginWithGithub() {
    window.location.assign("https://github.com/login/oauth/authorize?client_id=" + CLIENT_ID);
  }

  

  return (
    <div className="App">
      <header className="App-header">
        {/* Componenta UserInputForm pentru a permite utilizatorilor să introducă numele utilizatorilor GitHub */}
        <UserInputForm onSearch={onSearchFunction} />

        {/* Afișarea mesajului de eroare în caz de eroare */}
        {error && <p style={{ color: "red" }}>{error}</p>}

        {/* Verificarea dacă datele utilizatorilor sunt disponibile și afișarea acestora */}
        {userData1 && userData2 && (
          <div>
            <h2>Rezultate:</h2>
            <div>
              {/* Afișarea informațiilor despre primul utilizator */}
              <h3>Utilizator 1: {userData1.login}</h3>
              <p>Urmăritori: {userData1.followers}</p>
              <h4>Repository-uri:</h4>
              <ul>
                {/* Afișarea repository-urilor primului utilizator */}
                {userRepos1.map((repo) => (
                  <li key={repo.id}>
                    {repo.name} - Stargazers: {repo.stargazers_count}, Forks:{" "}
                    {repo.forks}, Commits from the last 3 months:{" "}
                    {repo.recentCommits}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              {/* Afișarea informațiilor despre al doilea utilizator */}
              <h3>Utilizator 2: {userData2.login}</h3>
              <p>Urmăritori: {userData2.followers}</p>
              <h4>Repository-uri:</h4>
              <ul>
                {/* Afișarea repository-urilor celui de-al doilea utilizator */}
                {userRepos2.map((repo) => (
                  <li key={repo.id}>
                    {repo.name} - Stargazers: {repo.stargazers_count}, Forks:{" "}
                    {repo.forks}, Commits from the last 3 months:{" "}
                    {repo.recentCommits}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

      
{localStorage.getItem("accessToken") ? (
          <>
            <h1>We have the access token</h1>
            <button
              onClick={() => {
                localStorage.removeItem("accessToken");
                setRerender(!rerender);
              }}
            >
              Log out
            </button>
            <h3>Get User Data from Github API</h3>
            <button onClick={getUserData}>Get Data</button>
            {Object.keys(userData).length !== 0 ? (
              <>
                <h4>Hey there {userData.login}</h4>
                <img width="100px" height="100px" src={userData.avatar_url} alt="User Avatar" />
              </>
            ) : (
              <>
              </>
            )}
          </>
        ) : (
          <>
            <h3>User is not logged in</h3>
            <button onClick={loginWithGithub}>Login With Github</button>
          </>
        )}
          
      </header>
    </div>
  );

}

export default App;
