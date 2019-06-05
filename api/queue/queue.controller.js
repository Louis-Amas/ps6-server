exports.getStudentForm = (req,res) => {
  return res.status(200).json({
        respUrl: "http:/student/appointment/student/arrive",
        method: "PUT",
        type: 'form',
        requiredField: [
            {
               type: "input",
               formatType: "email",
               showedName: "Email",
               value: "email"
            },
            {
                type: "input",
                formatType: "password",
                showedName: "Mot de passe",
                value: "password"
            }
        ],
        headers: {
            "Authorisation": "$email:$password"
        },
        body: {
            "status": "waiting"
        }
  });
};
