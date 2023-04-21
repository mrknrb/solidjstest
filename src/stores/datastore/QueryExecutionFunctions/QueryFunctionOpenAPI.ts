import axios from "axios"

export async  function QueryFunctionOpenAPI(args:any) {
    


const encodedParams = new URLSearchParams();
encodedParams.append("source_language", "en");
encodedParams.append("target_language", "id");
encodedParams.append("text", "What is your name?");

const options = {
  method: 'POST',
  url: 'https://text-translator2.p.rapidapi.com/translate',
  headers: {
    'content-type': 'application/x-www-form-urlencoded',
    'X-RapidAPI-Key': 'ebc3edfd17mshdbd4976e9f58968p194665jsn3d4b9036446a',
    'X-RapidAPI-Host': 'text-translator2.p.rapidapi.com'
  },
  data: encodedParams
};

axios.request(options).then(function (response) {
	console.log(response.data);
}).catch(function (error) {
	console.error(error);
});

}