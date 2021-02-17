module.exports = (sequelize, DataTypes) => {
  const Guest = sequelize.define('Guest', {
    userId: DataTypes.INTEGER,
    email: DataTypes.STRING,
    eventId: DataTypes.INTEGER,
  });

  Guest.associate = (models) => {
    Guest.belongsTo(models.Event, {
      foreignKey: 'eventId',
      as: "guests",
      onDelete: 'CASCADE',
    });

    Guest.belongsTo(models.User, {
      foreignKey: 'userId',
      onDelete: 'CASCADE',
    });

  };
  return Guest;
};