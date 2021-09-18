var ApiService = require('../services/ApiService');
exports.index = (req, res) => {
    ApiService.getAllUsers(req.user.facebook.id)
    //ApiService.getAllUsers('XXDD23482382834234')
    .then(result => {
        
        var data = [];
        if(result)
            data = result;
        console.log("Users Data", data);
        res.render('dashboard.ejs', {
            usersData: data,
            user: req.user
        });
    })
    .catch(ex => {
        res.render('dashboard.ejs', {
            user: req.user,
            usersData: [],
        });
        console.log(ex);
    });
    


};
  
