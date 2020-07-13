const opinionModel = require("../../models/opinion.js");
const mongoose = require("mongoose");
const opinion = require("../../models/opinion");

//id유효성 체크하는 함수
const checkId = (req, res, next) => {
  const id = req.params.id;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).end();
  }
  next();
};

//목록조회
const list = (req, res) => {
  let limit = req.query.limit || 10;
  limit = parseInt(limit, 10);

  if (Number.isNaN(limit)) {
    return res.status(400).end();
  }

  opinionModel
    .find((err, result) => {
      if (err) return res.status(500).end();

      //총합 구하기
      let sum = 0;
      for (let i = 0; i < result.length; i++) {
        sum += +result[i].score;
      }

      //랜덤하게 수를 정해줌 -> 이미지 바뀌게 하려고
      result.map((e) => {
        e.rand = Math.floor(Math.random() * 5) + 1;
        return e;
      });

      res.render("opinion/list", {
        result,
        avg: (sum / result.length).toFixed(1),
      });
    })
    .limit(limit)
    .sort({ _id: -1 });
};

//상세조회
const detail = (req, res) => {
  const id = req.params.id;
  opinionModel.findById(id, (err, result) => {
    if (err) return res.status(500).end();
    if (!result) return res.status(404).end();
    res.render("opinion/detail", { result });
  });
};

//등록
const create = (req, res) => {
  const { score, title, story } = req.body;
  if (!score || !title || !story) return res.status(400).end();

  opinionModel.create({ score, title, story }, (err, result) => {
    if (err) return res.status(500).send("등록 시 오류가 발생했습니다. ");
    res.status(201).json(result);
  });
};

//수정
const update = (req, res) => {
  const { score, title, story } = req.body;
  const id = req.params.id;

  //업데이트
  opinionModel.findByIdAndUpdate(
    id,
    { score, title, story },
    { new: true },
    (err, result) => {
      if (err) return res.status(500).send("수정 시 오류가 발생했습니다ㅠㅠ.");
      if (!result) return res.status(404).send("해당하는 정보가 없습니다!!.");
      res.json(result);
    }
  );
};

//삭제
const remove = (req, res) => {
  const id = req.params.id;

  opinionModel.findByIdAndRemove(id, (err, result) => {
    if (err) return res.status(500).send("삭제 시 오류가 발생했습니다ㅠㅠ.");
    if (!result) return res.status(404).end("해당하는 정보가 없습니다!!.");
    res.json(result);
  });
};

const showCreatePage = (req, res) => {
  res.render("opinion/create");
};

const showUpdatePage = (req, res) => {
  const id = req.params.id;

  opinionModel.findById(id, (err, result) => {
    if (err) return res.status(500).send("조회 시 오류가 발생했습니다ㅠㅠ.");
    if (!result) return res.status(404).send("해당하는 정보가 없습니다!!.");
    res.render("opinion/update", { result });
  });
};

const showMeal = (req, res) => {
  res.render("opinion/meal");
};

module.exports = {
  list,
  detail,
  create,
  update,
  remove,
  checkId,
  showCreatePage,
  showUpdatePage,
  showMeal,
};
