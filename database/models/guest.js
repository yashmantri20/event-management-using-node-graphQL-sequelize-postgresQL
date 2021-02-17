module.exports = (sequelize, DataTypes) => {
  const Guest = sequelize.define('Guest', {
    userId: DataTypes.INTEGER,
    email: DataTypes.STRING,
    eventId: DataTypes.INTEGER,
  });

  Guest.associate = (models) => {
    Guest.belongsTo(models.Event, {
      foreignKey: 'eventId',
      as: "events",
      onDelete: 'CASCADE',
    });

    Guest.belongsTo(models.User, {
      as: "users",
      foreignKey: 'userId',
      onDelete: 'CASCADE',
    });

  };
  return Guest;
};