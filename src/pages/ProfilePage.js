import React, { useContext, useState } from "react";
import { Button, Card, Col, Container, Image, Row } from "react-bootstrap";
import rupiahFormat from "rupiah-format";
import QRCode from "react-qr-code";
import { useQuery } from "react-query";
import moment from "moment/moment";
import { UserContext } from "../contexts/UserContext";
import { API } from "../configs/api";
import Logo from "../assets/icons/icon_logo_hero.svg";
import DefaultPicture from "../assets/images/default-profile.png";
import EditProfile from "../components/form/EditProfile";
import UpperCase from "../utils/UpperCase";

export default function ProfilePage() {
  document.title = "Waysbeans | My Profile";

  const [showForm, setShowForm] = useState(false);
  const [state] = useContext(UserContext);

  let { data: profile, refetch } = useQuery("profileCache", async () => {
    const response = await API.get("/profile");
    return response.data.data;
  });

  let { data: transaction } = useQuery("transactionsCache", async () => {
    const response = await API.get("/transactions");
    return response.data.data;
  });

  return (
    <Container>
      <Row className="p-5 gap-sm-5 gap-lg-0">
        <Col sm={12} xl={6} className="d-flex flex-column gap-3 my-3">
          <Col xs={12}>
            <h3 className="fw-bold color-main">My Profile</h3>
          </Col>
          <Col xs={12} className=" d-flex flex-row">
            <Col xs={5} className="d-flex flex-column gap-3 me-5">
              {profile?.image !== "" ? (
                <Image src={profile?.image} className="profile-img rounded" />
              ) : (
                <Image src={DefaultPicture} className="profile-img rounded" />
              )}
              <Button
                className="btn btn-navbar btn-main align-self-center col-6"
                onClick={() => setShowForm(true)}
              >
                Edit
              </Button>
            </Col>
            <Col xs={6} className="d-flex flex-column">
              <h5 className="fw-bold color-main">Name</h5>
              <p className="">{state.user.fullname}</p>
              <h5 className="fw-bold color-main">Email</h5>
              <p className="">{state.user.email}</p>
              <h5 className="fw-bold color-main">Phone</h5>
              <p className="">{profile?.phone ? profile?.phone : "-"}</p>
              <h5 className="fw-bold color-main">Address</h5>
              <p className="">{profile?.address ? profile?.address : "-"}</p>
            </Col>
          </Col>
        </Col>
        <Col sm={12} xl={6} className="d-flex flex-column gap-3 my-3">
          <Col xs={12}>
            <h3 className="fw-bold color-main">My Transaction</h3>
          </Col>
          {transaction?.map((item, index) => (
            <Card key={index} className="rounded-0">
              <Col className="d-flex flex-row p-2">
                <Card.Body className="d-flex flex-column p-0">
                  <Card.Title className="my-1 fs-7">
                    Transaction Number :{" "}
                    <span className="fw-normal float-end">{item.id}</span>
                  </Card.Title>
                  <Card.Title className="my-1 fs-7">
                    Transaction Date :{" "}
                    <span className="fw-normal float-end">
                      {moment(item.update_at).format("dddd, DD MMMM YYYY")}
                    </span>
                  </Card.Title>
                  <Card.Title className="my-1 fs-7">
                    Total :
                    <span className="fw-normal float-end">
                      {rupiahFormat.convert(item.total)}
                    </span>
                  </Card.Title>
                  <Card.Title className="my-1 fs-7">
                    Status :
                    {item.status === "success" ? (
                      <span className="float-end text-success">
                        {UpperCase(item.status)}
                      </span>
                    ) : (
                      <span className="float-end text-warning">
                        {UpperCase(item.status)}
                      </span>
                    )}
                  </Card.Title>
                </Card.Body>
                <Card.Body className="d-flex flex-column align-items-center gap-2 p-0">
                  <Card.Title>
                    <Card.Img src={Logo} className="img-cart" />
                  </Card.Title>
                  <Card.Subtitle>
                    <QRCode
                      value={item.id.toString()}
                      bgColor="transparent"
                      size={50}
                    />
                  </Card.Subtitle>
                </Card.Body>
              </Col>
              <Col className="d-flex flex-column p-2">
                {item?.cart?.map((e, i) => (
                  <Card
                    key={i}
                    className="d-flex flex-column flex-md-row align-items-center border-0"
                  >
                    <Card.Img
                      src={item.product.image}
                      className="img-cart rounded-0 p-2"
                    />
                    <Card.Body className="py-1">
                      <Card.Title className="my-1 color-main fw-bold">
                        {UpperCase(item.product.name)} Beans
                      </Card.Title>
                      <Card.Text className="my-1 fs-7">
                        Price : {rupiahFormat.convert(item.product.price)}
                      </Card.Text>
                      <Card.Text className="my-1 fs-7">
                        Quantity : {item.orderQuantity} Pcs
                      </Card.Text>
                      <Card.Text className="my-1 fs-7">
                        Subtotal :{" "}
                        {rupiahFormat.convert(
                          item.orderQuantity * item.product.price
                        )}
                      </Card.Text>
                    </Card.Body>
                  </Card>
                ))}
              </Col>
            </Card>
          ))}
        </Col>
      </Row>
      <EditProfile
        show={showForm}
        setShow={setShowForm}
        user={profile}
        refetch={refetch}
      />
    </Container>
  );
}
