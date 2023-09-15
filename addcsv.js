const repoOwner = "akaomerr";
const repoName = "cafeswebsite";
const filePath = "data.csv";

const apiUrl = `https://api.github.com/repos/${repoOwner}/${repoName}/contents/${filePath}`;

function clearForm() {
  document.getElementById("cafename").value = "";
  document.getElementById("cafedescription").value = "";
  document.getElementById("cafelocation").value = "";
  document.getElementById("token").value="";
}

document.getElementById("csvform").addEventListener("submit", function (event) {
  event.preventDefault();

  const cafename = document.getElementById("cafename").value;
  const cafedescription = document.getElementById("cafedescription").value;
  const cafelocation = document.getElementById("cafelocation").value;
  const accessToken = document.getElementById("token").value;
  const newData = `\n${cafename},${cafedescription},${cafelocation}`;

  fetch(apiUrl, {
    headers: {
      'Authorization': `token ${accessToken}`,
    },
  })
    .then((response) => {
      if (response.ok) {
        return response.json();
      } else {
        throw new Error(`HTTP Error: ${response.status}`);
      }
    })
    .then((data) => {
      const currentContentBase64 = data.content;
      const currentContentUtf8 = decodeURIComponent(escape(atob(currentContentBase64)));

      const updatedContentUtf8 = currentContentUtf8 + newData;
      const encoder = new TextEncoder();

      const updatedContentArray = encoder.encode(updatedContentUtf8);
      const updatedContentBase64 = btoa(String.fromCharCode.apply(null, updatedContentArray));

      const requestOptions = {
        method: 'PUT',
        headers: {
          'Authorization': `token ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: 'Data update',
          content: updatedContentBase64,
          sha: data.sha,
        }),
      };

      return fetch(apiUrl, requestOptions);
    })
    .then((response) => {
      if (response.ok) {
        return response.json();
      } else {
        throw new Error(`HTTP Error: ${response.status}`);
      }
    })
    .then((result) => {
      console.log('File Update Successfully:', result);
      clearForm();
    })
    .catch((error) => {
      console.error('Hata oluştu:', error);
    });
});
