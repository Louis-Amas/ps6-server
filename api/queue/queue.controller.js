exports.getStudentForm = (req,res) => {
  return res.status(200).json({
        respUrl: "/api/users/student/appointment/status",
        method: "PUT",
        type: 'form',
        requiredField: [
            {
               type: "input",
               formatType: "email",
               showedName: "Email",
               value: ""
            },
            {
                type: "input",
                formatType: "password",
                showedName: "Mot de passe",
                value: ""
            }
        ],
        headers: {
            Authorization: "$email?:$password?"
        }
  });
};
