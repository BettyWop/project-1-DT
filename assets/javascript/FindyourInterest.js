// page gathers ineterst for user who is login
auth.onAuthStateChanged(firebaseUser => {
    if (firebaseUser) {
        console.log("user is logged in");

        // grab the information of the current user
        database.ref("/userinfo")
            .orderByChild("userId")
            .equalTo(firebaseUser.uid)
            .once("child_added", function (snapshot) {
                console.log(snapshot.val());
                userInfo = snapshot.val();

                // this logic will limit user to only chose 3 ineterst 
                var limit = 3;
                $(".image").on("click", function () {
                    if ($(this).hasClass("imageselected")) {
                        $(this).removeClass("imageselected");
                        limit++;
                    }
                    else if (limit > 0) {
                        $(this).addClass("imageselected");
                        limit--;
                    }
                    else {
                        $('#myModal').modal('show'); 
                    }
                });

                // when user clicks on create account the new ineterst information will be added to the previous information from registration page  
                $("#create-account").on("click", function () {
                    //get values from the images with a class of imageselected
                    function newUserInfo() {
                        var userInterests = [];
                        $.each($('.imageselected'), function (i) {
                            var interestName = $(this).attr("id")
                            var interestCategory = $(this).attr("img-data")
                            var interestDataObject = {
                                type: interestName,
                                category: interestCategory
                            }
                            userInterests.push(interestDataObject);
                        })

                        // now gathering the basic information about the user from database 
                        console.log(userInterests);
                        var firstName = snapshot.val().firstName;
                        var lastName = snapshot.val().lastName;
                        var birthday = snapshot.val().birthday;
                        var pet = snapshot.val().pet;
                        var userId = snapshot.val().userId;
                        var zipcode = snapshot.val().zipcode;
                        var interst1 = userInterests[0];
                        var interst2 = userInterests[1];
                        var interst3 = userInterests[2];

                        // now creating the new user object 
                        var userCompelete = {
                            "firstName": firstName,
                            "lastName": lastName,
                            "birthday": birthday,
                            "pet": pet,
                            "userId": userId,
                            "zipcode": zipcode,
                            "interst1": interst1,
                            "interst2": interst2,
                            "interst3": interst3
                        }
                        var userKey = snapshot.key

                        // updating the database with new data
                        var updates = {};
                        updates['/userinfo/' + userKey] = userCompelete;
                        return database.ref().update(updates);

                    }

                    newUserInfo();
                    // move to next page 
                    window.location.href = "profile.html"

                });
            })
    }
    else {
        console.log("user id loged off")
    }
})
