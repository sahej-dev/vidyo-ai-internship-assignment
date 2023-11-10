function App() {
  return (
    <div className="App">
      <div className="container">
        <div className="row">
          <div className="col-md-8">
            <p className="text-muted my-3">
              <small>
                Open Developer Console for information about responses.
              </small>
            </p>
            <h1 className="my-3">1. Log in</h1>

            <h1 className="my-3">2. Upload an avatar</h1>
            <form
              onSubmit={(event) => {
                event.preventDefault();
                let input = document.getElementById("uploaded_file");

                let data = new FormData();
                data.append("title", "test video nice");
                data.append("file", input.files[0]);

                console.log("DATA:::", data);

                fetch("http://127.0.0.1:8000/api/audio-tasks/", {
                  method: "POST",
                  body: data,
                })
                  .then((response) => {
                    return response.json();
                  })
                  .then((data) => {
                    console.log(data);
                  })
                  .catch((error) => {
                    console.error("Error:::", error);
                  });
              }}
            >
              <div>
                <label htmlFor="uploaded_file">
                  Choose an image for your avatar
                </label>
                <input type="file" id="uploaded_file" />
              </div>
              <button type="submit" className="btn btn-primary">
                Upload
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
