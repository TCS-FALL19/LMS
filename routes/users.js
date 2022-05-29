var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});
app.get('/logout',authenticateToken,async (req,res)=>
{
try{

    res.clearCookie("token").status(200).send("logout successful");
}
catch{
    res.status(500).send();
}
});
module.exports = router;
