#!/bin/bash
echo "等待 MongoDB 啟動中..."
sleep 10

echo "初始化複製集..."
mongosh --host mongo1:27017 <<EOF
rs.initiate({
  _id: "rs0",
  members: [
    { _id: 0, host: "mongo1:27017", priority: 2 },
    { _id: 1, host: "mongo2:27017", priority: 1 },
    { _id: 2, host: "mongo3:27017", priority: 1 },
    { _id: 3, host: "mongo-arbiter:27017", arbiterOnly: true }
  ]
})
EOF

echo "複製集初始化完成。"
echo "檢查複製集狀態..."
mongosh --host mongo1:27017 --eval "rs.status()"

echo "設置複製集配置以提高可用性..."
mongosh --host mongo1:27017 <<EOF
cfg = rs.conf()
cfg.settings = {
  heartbeatTimeoutSecs: 5,
  electionTimeoutMillis: 5000,
  catchUpTimeoutMillis: 2000
}
rs.reconfig(cfg)

# 設置讀取偏好，允許從副本讀取
db.getMongo().setReadPref('secondaryPreferred')
EOF

echo "創建初始數據庫和集合..."
mongosh --host mongo1:27017 <<EOF
use pv_data_db
db.createCollection("schedules")
EOF

echo "設置自動故障轉移..."
mongosh --host mongo1:27017 <<EOF
cfg = rs.conf()
cfg.settings = cfg.settings || {}
cfg.settings.chainingAllowed = true
rs.reconfig(cfg)
EOF

echo "數據庫初始化完成，高可用性配置已設置。"
