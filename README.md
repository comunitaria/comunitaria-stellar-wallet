# COMUNITARIA STELLAR WALLET

Comunitaria Stellar Dashboard es una aplicación web para la gestión de una comunidad de uso de una moneda social digital [Stellar](https://stellar.org/es). 

Los monederos Android son aplicaciones móviles para pago y cobro en comercios asociados. Los monederos son autónomos. Una vez que de de alta a un participante, se le proporciona el nombre de usuario y clave asignados. El usuario puede crear un monedero y solo él dispondrá de las claves de acceso a su cuenta de la moneda social.

- - -

## Descarga

Usted puede clonar la aplicación desde el repositorio:

```
git clone https://github.com/comunitaria/comunitaria-stellar-wallet
```

- - -

## Instalación

### CMD Windows

Necesitará instalar los siguientes paquetes _(o superiores)_:

- NPM 7.5.6
- Ionic Cli 7.2.0
- Android Studio Jellyfish 2023.3.1

En el directorio de la aplicación, instale el cliente Capacitor:
```
> npm i -D @capacitor/cli
```
Debido a un problema de compatibilidad de la libreria Stellar (véase https://github.com/stellar/js-stellar-sdk/issues/914), es preciso editar el fichero node_modules\@stellar\stellar-sdk\types\dom-monkeypatch.d.ts (líneas 34 y ss) a:
```javascript
readonly CLOSED: 2;
readonly CONNECTING: 0;
readonly OPEN: 1;  
```
A continuación genere los ficheros Android con:
```
> ionic cap build android
```
En Android Studio, genere el fichero apk con Build > Buld App Bundle(s)/APK(s) > Build APK(s) y encuentre su fichero apk en android\app\build\outputs\apk.

Puede subir este archivo al servidor dashboard, en la ubicación ./public/assets/repositorio/monederoIlla.apk para que los usuarios puedan descargarlo desde la página de bienvenida.