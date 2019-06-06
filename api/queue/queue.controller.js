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
               value: "hasnaa@etu.unice.fr"
            },
            {
                type: "input",
                formatType: "password",
                showedName: "Mot de passe",
                value: "123"
            }
        ],
        headers: {
            Authorization: "$email?:$password?"
        }
  });
};
