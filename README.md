## Tools that need to be installed
- [Docker](https://www.docker.com/)
- [Make](https://community.chocolatey.org/packages/make)

## How to run the application?
- Clone this repository
- Open your terminal / cmd, and type the command on below:
    ```
    make runapp
    ```
- Make sure the service is running properly, as follows:
    ```
    $ docker ps
    CONTAINER ID   IMAGE                                      COMMAND                  CREATED          STATUS          PORTS                      NAMES
    50e04f635dc8   maslow123/keuanganku-client                "docker-entrypoint.s…"   5 seconds ago    Up 3 seconds    0.0.0.0:3030->3000/tcp     app
    ```
- Open your browser, and hit url http://localhost:3030
- Finish


## Design and color pallete references:
Design: https://dribbble.com/shots/17250392-Quari-Wallet/attachments/12357471?mode=media
Color palettes: https://www.canva.com/colors/color-palettes/to-the-sky/ 