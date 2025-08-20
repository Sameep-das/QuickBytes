import PropTypes from "prop-types";
import { Card, Avatar, Typography } from "@material-tailwind/react";

export function TeamCard({ img, name, position}) {
  return (
    <Card color="transparent" shadow={false} className="text-center h-full">
      <Avatar
        src={img}
        alt={name}
        size="xxl"
        variant="rounded"
        className="h-[200px] w-full object-cover shadow-lg shadow-gray-500/25"
      />
      <Typography variant="h5" color="blue-gray" className="mt-6 mb-1">
        {name}
      </Typography>
      {position && (
        <Typography className="font-bold text-blue-gray-500">
          {position}
        </Typography>
      )}
    </Card>
  );
}

TeamCard.defaultProps = {
  position: "",
};

TeamCard.propTypes = {
  img: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  position: PropTypes.string,
};

TeamCard.displayName = "/src/widgets/layout/team-card.jsx";

export default TeamCard;
