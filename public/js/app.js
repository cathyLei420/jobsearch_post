var app = angular.module('myapp', ['ngRoute']);

app.config(function($routeProvider) {
  $routeProvider.when('/', {
      templateUrl: '/views/login.html'
    })
    .when('/register', {
      templateUrl: '/views/register.html'
    })
    .when('/home/:uname', {
      template: `welcome to home`,
      resolve: ['authService', function(authService) {
        return authService.isLoggedIn();
      }]

    })
    .when('/postJob/:uname', {
      templateUrl: '/views/postJob.html',
      controller: 'postjobCtrl',
      resolve: ['authService', function(authService) {
        return authService.isLoggedIn();
      }]
    })
    .when('/searchJob/:uname', {
      //:uid get the argument
      templateUrl: '/views/searchJob.html',
      controller: 'searchjobCtrl',
      //for login authorization
      resolve: ['authService', function(authService) {
        return authService.isLoggedIn();
      }]
    })
    .when('/logout', {
      templateUrl: '/views/log in.html',
      resolve: ['deleteService', function(deleteService) {
        return deleteService.deleteLogin();
      }]
    })
    .otherwise({
      redirectTo: '/'
    });

});

app.factory('authService', function($http, $q, $location) {
  return {
    isLoggedIn: function() {
      var promise = $q.defer();
      $http.get('http://localhost:3000/getloginuser').then(function(data) {
        if (!data.data[0] || data.data[0] == undefined) {

          $location.path('/');
        }
      }).catch(function(err) {
        console.log(err);
      });

      return promise;
    }
  }
})

app.factory('deleteService', function($http, $q, $location, $rootScope) {
  return {
    deleteLogin: function() {
      $rootScope.isLogginFlg = false;
      var promise = $q.defer();
      $http.get("http://localhost:3000/deletelogin").then(function(data) {

        $location.path('/');
      }).catch(function(err) {
        console.log(err);
      });

      return promise;
    }

  }
})
//register control
app.controller('registerCtrl', function($http, $scope, $rootScope) {
  // $scope.selected = function(type) {
  //   $scope.user.type = type;
  // }
  // console.log($scope.user.type);
  $rootScope.types = ["Company", "Seekers"];
  $scope.register = function() {
    console.log($scope.user);
    $http.post('http://localhost:3000/createuser', $scope.user).then(function() {

      $location.path('/');
    }).catch(function(err) {
      console.log(err);
    })
  }
})

//login control
app.controller('loginCtrl', function($http, $scope, $rootScope, $location) {
  $rootScope.types = ["Company", "Seekers"];
  var clear = function() {
    if (document.getElementById('errorn')) {
      document.getElementById('errorn').style.display = "none";
    }
    if (document.getElementById('errorp')) {
      document.getElementById('errorp').style.display = "none";
    }
    if (document.getElementById('errort')) {
      document.getElementById('errort').style.display = "none";
    }
  }
  $scope.checkIfInput = function() {
    console.log($scope.user);
    if (!$scope.user) {
      alert("Sorry, all fields are empty");
      return;
    }
    if (!($scope.user.name && $scope.user.password && $scope.user.type)) {
      var errorn = '<p class="col-md-4 col-md-offset-4" id="errorn">Sorry,the field is empty! </p>';
      var errorp = '<p class="col-md-4 col-md-offset-4" id="errorp">Sorry,the field is empty! </p>';
      var errort = '<p class="col-md-4 col-md-offset-4" id="errort">Sorry,the field is empty! </p>';
      clear();
      if (!$scope.user.name) {
        document.getElementById('loginname').insertAdjacentHTML('afterend', errorn);
      }
      if (!$scope.user.password) {
        document.getElementById('loginpswd').insertAdjacentHTML('afterend', errorp);
      }
      if (!$scope.user.type) {
        document.getElementById('logintype').insertAdjacentHTML('afterend', errort);
      }
      return;
    }
    $http.post("http://localhost:3000/getuser", $scope.user).then(function(data) {

      var login = {
        "loginuser": $scope.user.name
      };
      if (data.data[0] && $scope.user.type == data.data[0].type) {
        console.log(data.data[0]);
        $http.post("http://localhost:3000/createlogin", login).then(function() {

        }).catch(function(err) {
          console.log(err);
        });
        $rootScope.isLogginFlg = true;
        if ($scope.user.type == "Company") {
          $rootScope.postJobflg = true;
          $rootScope.searchflg = false;
          $location.path('/home/' + $scope.user.name)
        } else {
          $rootScope.searchflg = true;
          $rootScope.postJobflg = false;
          $location.path('/home/' + $scope.user.name)
        }
        $rootScope.isLoggin = true;
        $rootScope.validName = $scope.user.name;

      } else {
        alert('wrong username or Password');
      }

    }).catch(function(err) {
      console.log(err);
    });

  }

});

//post job control
app.controller('postjobCtrl', function($scope, $http) {
  $scope.saveJob = function() {
    console.log($scope.job);
    $http.post('http://localhost:3000/createjob', $scope.job).then(function() {

    }).catch(function(err) {
      console.log(err);
    })
  }
})

app.controller('searchjobCtrl', function($scope, $http) {
  $scope.search = function() {
    //clean value is null
    var job = $scope.sjob;

    $http.post('http://localhost:3000/searchjob', job).then(function(data) {
      $scope.searchRes = data.data;
      $scope.reset($scope.sjob);
    }).catch(function(err) {
      console.log(err);
    })

  }

  $scope.reset = function(job) {
    angular.copy({}, job);
  }
})