import FoodItem from "./FoodItem";

const NewMenu = ({ restaurantId, menuData }) => {
  const items = [];
  for (const item of menuData["menu_items"]) {
    items.push(
      // make each of these an input with default inputs as the text
      // put that stuff in fooditem
      <p key={item["dish_name"]}>
        {item["dish_name"]}: {item["dish_price"]}
      </p>,
    );
  }
  const onSubmit = (e) => {
    e.preventDefault();
    // submit the current info held in the form
  };
  return (
    <>
      <p>This is restaurant {restaurantId}</p>
      {menuData ? <p>There is data</p> : <p>There is no data...</p>}
      {items}
      <form action="POST" onSubmit={onSubmit}></form>
      <p>This is a work in progress</p>
    </>
  );
};

export default NewMenu;
