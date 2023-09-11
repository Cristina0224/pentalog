import axios from "axios";

const BASE_URL = "https://api.github.com";

// Funcție pentru a obține datele despre un utilizator GitHub
export async function fetchUserData(username) {
  try {
    const response = await axios.get(`${BASE_URL}/users/${username}`);
    return response.data;
  } catch (error) {
    if (error.response && error.response.status === 404) {
      // Utilizatorul nu a fost găsit
      console.error("Utilizatorul nu a fost găsit pe GitHub.");
    } else {
      // Alte erori de rețea sau server
      console.error("Eroare la căutarea utilizatorilor:", error);
    }
    throw error;
  }
}

// Funcție pentru a obține repository-urile unui utilizator GitHub
export async function fetchUserRepositories(username) {
  try {
    const response = await axios.get(`${BASE_URL}/users/${username}/repos`);
    return response.data;
  } catch (error) {
    if (error.response && error.response.status === 404) {
      // Utilizatorul nu a fost găsit
      console.error("Utilizatorul nu a fost găsit pe GitHub.");
    } else {
      // Alte erori de rețea sau server
      console.error("Eroare la obținerea repository-urilor:", error);
    }
    throw error;
  }
}

// Funcție pentru a obține commit-urile unui repository în ultimele 3 luni
export async function fetchRepositoryCommits(username, repoName) {
  try {
    const currentDate = new Date();
    const threeMonthsAgo = new Date();
    threeMonthsAgo.setMonth(currentDate.getMonth() - 3);

    const response = await axios.get(
      `${BASE_URL}/repos/${username}/${repoName}/commits`,
      {
        params: {
          since: threeMonthsAgo.toISOString(),
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error(
      `Eroare la obținerea commit-urilor pentru ${repoName}:`,
      error
    );
    throw error;
  }
}
