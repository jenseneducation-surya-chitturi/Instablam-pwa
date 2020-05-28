export default () => {
    let servicew;
    //Genereras på servern
    const publicKey ='BN321PVm_GmpQ5hE-RNxF1EITjJ0l4JXjE78_iQsz2qA2tFKOrfvvqOtxI5OVDvZD3OJcraNV8wjgij8cb06XWU';
     
      if ('serviceWorker' in navigator && 'PushManager' in window) {
        //Hämta våran service worker och sedan kolla om vi redan har en subscription
        navigator.serviceWorker.ready.then((sw) => {
          servicew = sw;
          sw.pushManager.getSubscription().then((subscription) => {
            console.log('Is subscribed: ', subscription);
            if (subscription !== null) {
              document.querySelector('.subInfo').innerHTML = 'Unsubscribe from notifications'
            }
          });
    
        });
      }
    
      const urlB64ToUint8Array = (base64String) => {
        const padding = '='.repeat((4 - (base64String.length % 4)) % 4)
        const base64 = (base64String + padding).replace(/\-/g, '+').replace(/_/g, '/')
        const rawData = atob(base64)
        const outputArray = new Uint8Array(rawData.length)
        for (let i = 0; i < rawData.length; ++i) {
          outputArray[i] = rawData.charCodeAt(i)
        }
        return outputArray
      }
    
      //Skickar vår endpoint för att användas på servern
      async function saveSubscription(subscription) {
        const url = "https://push-notifications-api.herokuapp.com/api/notifications/save";
        const response = await fetch(url, {
          method: 'POST',
          body: JSON.stringify(subscription),
          headers: {
            'Content-Type': 'application/json'
          }
        });
        const data = await response.json();
        console.log(data.uuid);
      }
    
  
      function subInfoText(isSubscribed) {
        const info = document.createElement('p');
        document.querySelector('.push').appendChild(info);
        document.querySelector('#subText').classList.toggle('hidden');
        document.querySelector('#subscribe').classList.toggle('hidden');
        if (isSubscribed === true) {
          info.innerHTML = 'You have successfully unsubscribed.'
          setTimeout(() => {
            info.parentElement.removeChild(info);
            document.querySelector('#subText').classList.toggle('hidden');
            document.querySelector('#subscribe').classList.toggle('hidden');
          }, 5000)
        } else if (isSubscribed === false) {
          info.innerHTML = 'You are now subscribed to push-notifications from us. Yay!'
          setTimeout(() => {
            info.parentElement.removeChild(info);
            document.querySelector('#subText').classList.toggle('hidden');
            document.querySelector('#subscribe').classList.toggle('hidden');
          }, 5000)
        }
      }
    
      document.querySelector('#subscribe').addEventListener('click', (event) => {
        event.srcElement.disabled = true;
        servicew.pushManager.getSubscription().then(async (subscription) => {
          if (subscription) {
            subscription.unsubscribe(); //Sluta prenumerera på push notiser
            event.srcElement.disabled = false;
            subInfoText(true);
            document.querySelector('.pushInfo').innerHTML = 'Get notifications from us'
          } else {
            try {
              //Start subscribing to push notifications and save subscription on remote server via endpoint API
              const subscribed = await servicew.pushManager.subscribe({
                userVisibleOnly: true,
                applicationServerKey: urlB64ToUint8Array(publicKey)
              });
              saveSubscription(subscribed);
              console.log(subscribed);
              event.srcElement.disabled = false;
              subInfoText(false);
              document.querySelector('.pushInfo').innerHTML = 'Unsubscribe from notifications'
            } catch (error) {}
          }
        });
      });
    }