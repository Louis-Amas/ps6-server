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
               value: "email@test.com"
            },
            {
                type: "input",
                formatType: "password",
                showedName: "Mot de passe",
                value: "password"
            }
        ],
        headers: {
            Authorization: "$email?:$password?"
        }
  });
};
