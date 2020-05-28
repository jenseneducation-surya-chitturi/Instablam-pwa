function requestNotificationPermission() {
    Notification.requestPermission().then((response) => {
      console.log(response);
    });
  }
  
  function createNotification(imgUrl) {
    const icon = 'images/icons/apple-touch-icon.png';
    const text = new Image;
  
    const notification = new Notification("News: ", { body: text, icon: icon,
    });
  
    notification.addEventListener("click", (event) => {
      window.open("https://localhost:8000/");
    });
  }
  
  export { requestNotificationPermission, createNotification };