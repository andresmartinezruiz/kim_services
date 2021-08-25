### SISTEMA KIM SERVICES
* Sistema de tecnicos
* Sistemas de stock
* Reportes

### PROBAR EL API DEL SISTEMA

Para empezar a interar con el sistema simplemente corre el runserver y ve al root del sitio con un navegador.

Y veras lo siguiente.

 ![First page of the system](/img/fpage.png)

  La primera APP de prueba creada esta en [APP_APRUEBA](http://localhost:8001/imp_man/dinamic_template/?template_name=imp_man/PruebaUi.html&standalone=1).

 Observa como se componen la peticion http

  * ROOT_URL = http://localhost:8001
  * PAGE (urls.py) = /imp_man/dinamic_template/
  * STRING_QUERY (Es un csv que se separa por &):
    - template_name=imp_man/PruebaUi.html
    - standalone=1

 Eso te da esto.

 ![DEMO PAGE](/img/dpage.png)

  HAPPY CODING!!
