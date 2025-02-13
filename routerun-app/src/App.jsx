import axios from 'axios';

export default function App() {

  let zipcode = '9071801';
  axios.get(`https://api.zipaddress.net/?zipcode=${zipcode}`)
      .then(function (response) {
          console.log(response);
      })
      .catch(function (response) {
          console.log(response);
      });
  return (
    <>
      <h1 className="text-3xl font-bold underline text-red-500">
        Hello world!
      </h1>
      <h1>
        Hello world!
      </h1>
    </>
  )
}
