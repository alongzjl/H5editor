environments {
    dev {
        jdbc {
           driver = "com.mysql.jdbc.Driver"
           url = "jdbc:mysql://116.62.245.1:3306/h5?useUnicode=true&characterEncoding=utf8&allowMultiQueries=true"
           username = "root"
           password = "popPassword"
        }

        pool {
           maxActive = 40
           maxIdle = 10
        }

        mail{
            host = "smtp.163.com"
            username = "mad@163.com"
            password = "xxx"
        }

        project{
            domain = "http://localhost:8080/dist/upload/"
            uploadFolder = "/Users/sunlong/dev/projects/sunlong/h5/frontend/dist/upload"
            htmlFolder = "/Users/sunlong/dev/projects/sunlong/h5/frontend/dist/"
        }

        server{
            port = 9080
        }

        remoteApi{
            domain = "https://api.gopopon.com"
        }
    }

    test {
        jdbc {
           driver = "com.mysql.jdbc.Driver"
           url = "jdbc:mysql://116.62.245.1:3306/h5?useUnicode=true&characterEncoding=utf-8&allowMultiQueries=true"
           username = "root"
           password = "popPassword"
        }

        pool {
           maxActive = 40
           maxIdle = 10
        }

        mail{
            host = "smtp.163.com"
            username = "123@163.com"
            password = "xxx"
        }

        project{
            domain = "http://editor.gopopon.com/upload/"
            uploadFolder = "/usr/share/nginx/xyznotes/upload"
            htmlFolder = "/root/www/front/"
        }

        server{
            port = 9090
        }

        remoteApi{
            domain = "http://192.168.1.48"
        }
    }

    production {
        jdbc {
            driver = "com.mysql.jdbc.Driver"
            url = "jdbc:mysql://116.62.245.1:3306/h5?useUnicode=true&characterEncoding=utf-8&allowMultiQueries=true"
            username = "root"
            password = "popPassword"
        }

        pool {
            maxActive = 40
            maxIdle = 10
        }

        mail{
            host = "smtp.163.com"
            username = "123@163.com"
            password = "xxx"
        }

        project{
            domain = "http://editor.gopopon.com/upload/"
            uploadFolder = "/root/www/front/upload"
            htmlFolder = "/root/www/front/"
        }

        server{
            port = 9080
        }

        remoteApi{
            domain = "https://api.gopopon.com"
        }
    }
}
