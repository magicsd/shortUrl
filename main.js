$(() => {
  const $input = $('#linkInput');
  const $shorten = $('#shorten');
  const $expand = $('#expand');
  const $result = $('#result');
  const $error = $('#error');

  const url = 'https://www.googleapis.com/urlshortener/v1/url';
  const apiKey = 'AIzaSyAOcp8vlJuWRUlf1tTFrTeDxosUElQj5gc';

  $expand.click(makeLong);
  $shorten.click(makeShort);
  $input.focus(() => {if ($result.text() != '') $result.text('')});

  async function makeLong() {
    if (isUrlOK()) {
      const shortUrl = $input.val();
      const fetchUrl = url + '?shortUrl=' + shortUrl + '&key=' + apiKey;
      try {
        let respond = await fetch(fetchUrl);
        if (respond.ok) {
          let jsonRespond = await respond.json();
          $result.text(jsonRespond.longUrl);
          $input.val('');
          return jsonRespond;
        }
        throw $error.text('Неправильная ссылка!');
      } catch (error) {
        console.log(error);
        hideError();
        $input.val('').focus();
      }
    }
  }

  async function makeShort() {
    if (isUrlOK()) {
      const longUrl = $input.val();
      const fetchUrl = url + '?key=' + apiKey;
      try {
        const respond = await fetch(fetchUrl, {
          method: 'POST',
          headers: {'Content-type': 'application/json'},
          body: JSON.stringify({longUrl})
        })
        if (respond.ok) {
          let jsonRespond = await respond.json();
          $result.text(jsonRespond.id);
          $input.val('');
          return jsonRespond;
        }
        throw $error.text('Ошибка!');
      } catch (error) {
        console.log(error);
        hideError();
        $input.val('').focus();
      }
    }
  }

  function hideError() {
    const timer = setTimeout(() => $error.text(''), 1000);
  }

  function isUrlOK() {
    if ($input.val() === '') {
      $error.text('Пустое поле!');
      hideError();
      $input.focus();
      return false;
    }
    if ($input.val().slice(0, 4) != 'http') {
      $error.text('Неправильная ссылка!');
      console.log($input.val().slice(0, 4));
      $input.val('').focus();
      hideError();
      return false;
    }
    return true;
  }
});
