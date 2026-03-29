# -*- coding: utf-8 -*-
"""
Twilight 博客文章撰写工具 - 深色科技风版
支持单文件/文件夹两种文章方案，集成部署功能
"""

import sys
import os
import re
import subprocess
import shutil
from datetime import datetime

from PyQt5.QtWidgets import (
    QApplication, QMainWindow, QWidget, QVBoxLayout, QHBoxLayout, QSplitter,
    QListWidget, QListWidgetItem, QTextEdit, QPushButton, QLabel, QLineEdit,
    QComboBox, QCheckBox, QDateTimeEdit, QFileDialog, QMessageBox, QTabWidget,
    QPlainTextEdit, QGroupBox, QFormLayout, QSpinBox, QGridLayout, QFrame,
    QMenu, QAction, QInputDialog
)
from PyQt5.QtCore import Qt, QProcess, QDateTime, pyqtSignal, QTimer
from PyQt5.QtGui import QFont, QIcon, QPalette, QColor

# 依赖检查与导入
try:
    import yaml
except ImportError:
    yaml = None

try:
    import frontmatter
except ImportError:
    frontmatter = None

try:
    import markdown
except ImportError:
    markdown = None


# =========================== 辅助函数 ===========================
def ensure_dependencies():
    """检查依赖并提示安装"""
    missing = []
    if yaml is None:
        missing.append("PyYAML")
    if frontmatter is None:
        missing.append("python-frontmatter")
    if markdown is None:
        missing.append("markdown")
    if missing:
        QMessageBox.critical(
            None,
            "缺少依赖",
            f"请先安装以下 Python 库：\n\n{', '.join(missing)}\n\n"
            "运行命令：\npip install " + " ".join(missing)
        )
        return False
    return True


def slugify(title):
    """将标题转为合法的文件夹/文件名 slug"""
    s = title.lower().strip()
    s = re.sub(r'[^\w\s-]', '', s)
    s = re.sub(r'[\s_-]+', '-', s)
    return s


def get_posts_dir():
    """获取文章存放目录"""
    script_dir = os.path.dirname(os.path.abspath(__file__))
    posts_dir = os.path.join(script_dir, "src", "content", "posts")
    if not os.path.exists(posts_dir):
        os.makedirs(posts_dir)
    return posts_dir


def get_dp_cmd_path():
    """获取 dp.cmd 脚本路径"""
    script_dir = os.path.dirname(os.path.abspath(__file__))
    return os.path.join(script_dir, "dp.cmd")


def parse_markdown_file(filepath):
    """解析 Markdown 文件，返回 frontmatter 字典和正文内容"""
    if not frontmatter:
        return {}, ""
    try:
        post = frontmatter.load(filepath)
        return dict(post.metadata), post.content
    except Exception as e:
        print(f"解析文件失败 {filepath}: {e}")
        return {}, ""


def save_markdown_file(filepath, metadata, content):
    """保存 Markdown 文件"""
    if not frontmatter:
        return False
    try:
        post = frontmatter.Post(content, **metadata)
        with open(filepath, "wb") as f:
            frontmatter.dump(post, f)
        return True
    except Exception as e:
        print(f"保存文件失败 {filepath}: {e}")
        return False


def get_article_info_from_path(path):
    """
    根据路径解析文章信息
    返回: (url_slug, is_folder, index_md_path)
    """
    if os.path.isfile(path) and path.endswith('.md'):
        # 单文件方案
        base = os.path.basename(path)
        slug = base[:-3]  # 去掉 .md
        return slug, False, path
    elif os.path.isdir(path):
        # 文件夹方案
        index_path = os.path.join(path, 'index.md')
        if os.path.exists(index_path):
            return os.path.basename(path), True, index_path
    return None, False, None


def scan_all_articles(posts_dir):
    """
    递归扫描 posts 目录，返回文章列表
    每项: (display_name, url_slug, article_type, index_path)
    article_type: 'file' 或 'folder'
    """
    articles = []
    if not os.path.exists(posts_dir):
        return articles

    for item in os.listdir(posts_dir):
        item_path = os.path.join(posts_dir, item)

        # 单文件 .md
        if os.path.isfile(item_path) and item.endswith('.md'):
            slug = item[:-3]
            articles.append((item, slug, 'file', item_path))

        # 文件夹方案
        elif os.path.isdir(item_path):
            index_path = os.path.join(item_path, 'index.md')
            if os.path.exists(index_path):
                # 读取 frontmatter 获取标题用于显示
                metadata, _ = parse_markdown_file(index_path)
                title = metadata.get('title', item)
                display = f"{title} [文件夹]"
                articles.append((display, item, 'folder', index_path))

    # 按最后修改时间倒序排列
    articles.sort(key=lambda x: os.path.getmtime(x[3]), reverse=True)
    return articles


# =========================== 深色科技风样式 ===========================
DARK_STYLE = """
QMainWindow, QWidget {
    background-color: #0a0e1a;
    color: #e0e0e0;
    font-family: 'Segoe UI', 'Consolas', 'Monaco', monospace;
}

QListWidget {
    background-color: #0f1322;
    border: 1px solid #2a2e3f;
    border-radius: 6px;
    padding: 4px;
    outline: none;
}
QListWidget::item {
    padding: 8px;
    border-radius: 4px;
    margin: 2px 0;
}
QListWidget::item:selected {
    background-color: #1e2a3e;
    border-left: 3px solid #00aaff;
}
QListWidget::item:hover {
    background-color: #151a2a;
}

QTextEdit, QPlainTextEdit {
    background-color: #0b0f1a;
    border: 1px solid #2a2e3f;
    border-radius: 4px;
    font-family: 'Consolas', 'Monaco', monospace;
    font-size: 12pt;
    selection-background-color: #2a4c7a;
}

QLineEdit, QComboBox, QDateTimeEdit, QSpinBox {
    background-color: #0f1322;
    border: 1px solid #2a2e3f;
    border-radius: 4px;
    padding: 4px 6px;
    color: #e0e0e0;
}
QLineEdit:focus, QComboBox:focus, QDateTimeEdit:focus {
    border-color: #00aaff;
}

QPushButton {
    background-color: #1a1f2e;
    border: 1px solid #2a2e3f;
    border-radius: 4px;
    padding: 6px 12px;
    color: #e0e0e0;
    font-weight: bold;
}
QPushButton:hover {
    background-color: #2a2e4a;
    border-color: #3a6ea5;
}
QPushButton:pressed {
    background-color: #0f1322;
}
QPushButton:disabled {
    color: #5a5e6f;
}

QTabWidget::pane {
    background-color: #0a0e1a;
    border: 1px solid #2a2e3f;
    border-radius: 4px;
}
QTabBar::tab {
    background-color: #0f1322;
    padding: 6px 16px;
    margin-right: 2px;
    border-top-left-radius: 4px;
    border-top-right-radius: 4px;
}
QTabBar::tab:selected {
    background-color: #1a1f2e;
    border-bottom: 2px solid #00aaff;
}
QTabBar::tab:hover {
    background-color: #151a2a;
}

QGroupBox {
    border: 1px solid #2a2e3f;
    border-radius: 6px;
    margin-top: 10px;
    font-weight: bold;
}
QGroupBox::title {
    subcontrol-origin: margin;
    left: 10px;
    padding: 0 5px;
}

QScrollBar:vertical {
    background-color: #0a0e1a;
    width: 12px;
    border-radius: 6px;
}
QScrollBar::handle:vertical {
    background-color: #2a2e4a;
    border-radius: 6px;
    min-height: 20px;
}
QScrollBar::handle:vertical:hover {
    background-color: #3a6ea5;
}

QStatusBar {
    background-color: #0a0e1a;
    color: #8a8e9f;
}

QSplitter::handle {
    background-color: #2a2e3f;
}
"""


# =========================== 文章编辑器控件 ===========================
class ArticleEditor(QWidget):
    """文章编辑面板，支持两种文章类型"""
    def __init__(self, parent=None):
        super().__init__(parent)
        self.current_path = None      # 当前文章路径（index.md 或 .md 文件）
        self.article_type = 'file'    # 'file' 或 'folder'
        self.url_slug = None
        self.init_ui()

    def init_ui(self):
        main_layout = QVBoxLayout(self)
        main_layout.setContentsMargins(8, 8, 8, 8)

        # 状态栏信息
        self.status_label = QLabel("未打开文章")
        self.status_label.setStyleSheet("color: #6a6e7f; padding: 4px;")
        main_layout.addWidget(self.status_label)

        # Tab 控件
        self.tabs = QTabWidget()
        main_layout.addWidget(self.tabs)

        # ---------- 元数据表单 ----------
        meta_widget = QWidget()
        meta_layout = QFormLayout(meta_widget)
        meta_layout.setLabelAlignment(Qt.AlignRight)

        # 基础字段
        self.title_edit = QLineEdit()
        meta_layout.addRow("标题:", self.title_edit)

        self.desc_edit = QLineEdit()
        meta_layout.addRow("描述:", self.desc_edit)

        self.published_dt = QDateTimeEdit()
        self.published_dt.setDateTime(QDateTime.currentDateTime())
        self.published_dt.setCalendarPopup(True)
        self.published_dt.setDisplayFormat("yyyy-MM-dd HH:mm:ss")
        meta_layout.addRow("发布时间:", self.published_dt)

        self.tags_edit = QLineEdit()
        self.tags_edit.setPlaceholderText("多个标签用英文逗号分隔")
        meta_layout.addRow("标签:", self.tags_edit)

        self.category_edit = QLineEdit()
        meta_layout.addRow("分类:", self.category_edit)

        # 作者信息
        self.author_edit = QLineEdit()
        meta_layout.addRow("作者:", self.author_edit)

        self.license_edit = QLineEdit()
        self.license_edit.setPlaceholderText("如: MIT, CC BY 4.0")
        meta_layout.addRow("许可证:", self.license_edit)

        self.source_link_edit = QLineEdit()
        meta_layout.addRow("源链接:", self.source_link_edit)

        # 封面图片
        cover_layout = QHBoxLayout()
        self.cover_edit = QLineEdit()
        cover_layout.addWidget(self.cover_edit)
        self.cover_browse_btn = QPushButton("浏览...")
        self.cover_browse_btn.clicked.connect(self.browse_cover)
        cover_layout.addWidget(self.cover_browse_btn)
        meta_layout.addRow("封面路径:", cover_layout)

        self.cover_alt_edit = QLineEdit()
        meta_layout.addRow("封面描述:", self.cover_alt_edit)

        # 选项
        self.draft_cb = QCheckBox("草稿 (draft)")
        meta_layout.addRow("", self.draft_cb)

        self.comment_cb = QCheckBox("允许评论")
        self.comment_cb.setChecked(True)
        meta_layout.addRow("", self.comment_cb)

        self.encrypted_cb = QCheckBox("加密文章")
        self.encrypted_cb.toggled.connect(self.on_encrypted_toggled)
        meta_layout.addRow("", self.encrypted_cb)

        self.password_edit = QLineEdit()
        self.password_edit.setPlaceholderText("文章访问密码")
        self.password_edit.setEnabled(False)
        meta_layout.addRow("密码:", self.password_edit)

        self.pinned_cb = QCheckBox("置顶")
        meta_layout.addRow("", self.pinned_cb)

        # 额外字段
        self.extra_edit = QPlainTextEdit()
        self.extra_edit.setPlaceholderText("其他 YAML 字段（每行一个键值对）")
        self.extra_edit.setMaximumHeight(100)
        meta_layout.addRow("额外字段:", self.extra_edit)

        self.tabs.addTab(meta_widget, "📄 元数据")

        # ---------- 正文编辑 ----------
        self.content_edit = QPlainTextEdit()
        self.content_edit.setFont(QFont("Courier New", 11))
        self.tabs.addTab(self.content_edit, "✍️ 正文")

        # ---------- 预览 ----------
        self.preview_text = QTextEdit()
        self.preview_text.setReadOnly(True)
        self.tabs.addTab(self.preview_text, "👁️ 预览")

        # 更新预览定时器
        self.update_preview_timer = QTimer()
        self.update_preview_timer.setSingleShot(True)
        self.update_preview_timer.timeout.connect(self.update_preview)
        self.content_edit.textChanged.connect(self.on_content_changed)

    def browse_cover(self):
        """选择封面图片文件"""
        file_path, _ = QFileDialog.getOpenFileName(
            self, "选择封面图片", "",
            "Images (*.png *.jpg *.jpeg *.gif *.bmp);;All Files (*)"
        )
        if file_path:
            # 计算相对路径
            script_dir = os.path.dirname(os.path.abspath(__file__))
            posts_dir = get_posts_dir()
            if self.current_path and self.current_path.startswith(posts_dir):
                # 相对于文章所在目录
                article_dir = os.path.dirname(self.current_path)
                rel_path = os.path.relpath(file_path, article_dir)
                rel_path = rel_path.replace('\\', '/')
                self.cover_edit.setText(rel_path)
            else:
                # 默认相对路径
                rel_path = os.path.relpath(file_path, script_dir)
                self.cover_edit.setText(rel_path)

    def on_encrypted_toggled(self, checked):
        self.password_edit.setEnabled(checked)

    def on_content_changed(self):
        self.update_preview_timer.start(500)

    def update_preview(self):
        """Markdown 转 HTML 预览"""
        if not markdown:
            self.preview_text.setPlainText("未安装 markdown 库，无法预览。")
            return
        md_text = self.content_edit.toPlainText()
        try:
            html = markdown.markdown(md_text, extensions=['extra', 'codehilite'])
            self.preview_text.setHtml(html)
        except Exception as e:
            self.preview_text.setPlainText(f"预览渲染错误: {e}")

    def load_from_path(self, index_path, article_type, url_slug):
        """加载文章到编辑器"""
        metadata, content = parse_markdown_file(index_path)
        if not metadata and not content:
            return False

        self.current_path = index_path
        self.article_type = article_type
        self.url_slug = url_slug

        # 更新状态栏
        type_str = "文件夹方案" if article_type == 'folder' else "单文件方案"
        self.status_label.setText(f"📁 {url_slug} [{type_str}]")

        # 填充表单
        self.title_edit.setText(metadata.get("title", ""))
        self.desc_edit.setText(metadata.get("description", ""))

        pub = metadata.get("published") or metadata.get("pubDate") or metadata.get("date")
        if pub:
            try:
                if isinstance(pub, datetime):
                    dt = QDateTime(pub)
                else:
                    dt = QDateTime.fromString(str(pub), "yyyy-MM-dd HH:mm:ss")
                    if not dt.isValid():
                        dt = QDateTime.fromString(str(pub), "yyyy-MM-dd")
                self.published_dt.setDateTime(dt)
            except:
                self.published_dt.setDateTime(QDateTime.currentDateTime())
        else:
            self.published_dt.setDateTime(QDateTime.currentDateTime())

        tags = metadata.get("tags", [])
        if isinstance(tags, list):
            self.tags_edit.setText(", ".join(tags))
        else:
            self.tags_edit.setText(str(tags))

        self.category_edit.setText(metadata.get("category", ""))
        self.author_edit.setText(metadata.get("author", ""))
        self.license_edit.setText(metadata.get("licenseName", ""))
        self.source_link_edit.setText(metadata.get("sourceLink", ""))

        # 处理封面
        cover = metadata.get("image")
        if isinstance(cover, dict):
            self.cover_edit.setText(cover.get("url", ""))
            self.cover_alt_edit.setText(cover.get("alt", ""))
        else:
            self.cover_edit.setText(str(cover) if cover else "")
            self.cover_alt_edit.setText("")

        self.draft_cb.setChecked(metadata.get("draft", False))
        self.comment_cb.setChecked(metadata.get("comment", True))
        self.encrypted_cb.setChecked(metadata.get("encrypted", False))
        self.password_edit.setText(metadata.get("password", ""))
        self.pinned_cb.setChecked(metadata.get("pinned", False))

        # 额外字段
        std_keys = {"title", "description", "published", "pubDate", "date", "tags",
                    "category", "author", "licenseName", "sourceLink", "image",
                    "draft", "comment", "encrypted", "password", "pinned"}
        extra = {k: v for k, v in metadata.items() if k not in std_keys}
        extra_str = "\n".join(f"{k}: {v}" for k, v in extra.items())
        self.extra_edit.setPlainText(extra_str)

        self.content_edit.setPlainText(content)
        self.update_preview()
        return True

    def get_metadata(self):
        """从表单构建 metadata 字典"""
        metadata = {}

        metadata["title"] = self.title_edit.text().strip()
        metadata["description"] = self.desc_edit.text().strip()
        pub_dt = self.published_dt.dateTime().toPyDateTime()
        metadata["published"] = pub_dt.strftime("%Y-%m-%d %H:%M:%S")

        tags_str = self.tags_edit.text().strip()
        if tags_str:
            metadata["tags"] = [t.strip() for t in tags_str.split(",") if t.strip()]
        else:
            metadata["tags"] = []

        cat = self.category_edit.text().strip()
        if cat:
            metadata["category"] = cat

        author = self.author_edit.text().strip()
        if author:
            metadata["author"] = author

        license_name = self.license_edit.text().strip()
        if license_name:
            metadata["licenseName"] = license_name

        source_link = self.source_link_edit.text().strip()
        if source_link:
            metadata["sourceLink"] = source_link

        cover_url = self.cover_edit.text().strip()
        cover_alt = self.cover_alt_edit.text().strip()
        if cover_url:
            metadata["image"] = {"url": cover_url, "alt": cover_alt}

        metadata["draft"] = self.draft_cb.isChecked()
        metadata["comment"] = self.comment_cb.isChecked()
        metadata["encrypted"] = self.encrypted_cb.isChecked()
        if self.encrypted_cb.isChecked():
            pwd = self.password_edit.text().strip()
            if pwd:
                metadata["password"] = pwd
        metadata["pinned"] = self.pinned_cb.isChecked()

        # 处理额外字段
        extra_text = self.extra_edit.toPlainText().strip()
        if extra_text:
            for line in extra_text.splitlines():
                if ":" in line:
                    key, val = line.split(":", 1)
                    metadata[key.strip()] = val.strip()

        return metadata

    def save_current(self):
        """保存当前文章"""
        if not self.current_path:
            return False
        metadata = self.get_metadata()
        content = self.content_edit.toPlainText()
        return save_markdown_file(self.current_path, metadata, content)

    def is_modified(self):
        """简单判断是否有未保存修改（可扩展）"""
        return True


# =========================== 文章列表（递归扫描） ===========================
class ArticleList(QListWidget):
    """显示所有文章的列表，支持递归扫描"""
    article_selected = pyqtSignal(str, str, str)  # index_path, article_type, url_slug

    def __init__(self, parent=None):
        super().__init__(parent)
        self.posts_dir = get_posts_dir()
        self.itemClicked.connect(self.on_item_clicked)
        self.setContextMenuPolicy(Qt.CustomContextMenu)
        self.customContextMenuRequested.connect(self.show_context_menu)

    def refresh(self):
        """刷新列表"""
        self.clear()
        articles = scan_all_articles(self.posts_dir)
        for display, slug, art_type, index_path in articles:
            item = QListWidgetItem(display)
            item.setData(Qt.UserRole, (index_path, art_type, slug))
            self.addItem(item)

    def on_item_clicked(self, item):
        data = item.data(Qt.UserRole)
        if data:
            index_path, art_type, slug = data
            self.article_selected.emit(index_path, art_type, slug)

    def show_context_menu(self, position):
        item = self.itemAt(position)
        if not item:
            return
        menu = QMenu()
        delete_action = QAction("删除文章", self)
        delete_action.triggered.connect(lambda: self.delete_article(item))
        menu.addAction(delete_action)
        menu.exec_(self.viewport().mapToGlobal(position))

    def delete_article(self, item):
        data = item.data(Qt.UserRole)
        if not data:
            return
        index_path, art_type, slug = data
        reply = QMessageBox.question(
            self, "确认删除",
            f"确定要删除文章「{slug}」吗？\n\n此操作不可恢复！",
            QMessageBox.Yes | QMessageBox.No
        )
        if reply == QMessageBox.Yes:
            try:
                if art_type == 'folder':
                    # 删除整个文件夹
                    folder_path = os.path.dirname(index_path)
                    shutil.rmtree(folder_path)
                else:
                    os.remove(index_path)
                self.refresh()
                QMessageBox.information(self, "成功", "文章已删除")
            except Exception as e:
                QMessageBox.critical(self, "错误", f"删除失败: {e}")


# =========================== 部署执行器 ===========================
class DeployProcess(QProcess):
    """异步执行 dp.cmd"""
    log_signal = pyqtSignal(str)

    def __init__(self, parent=None):
        super().__init__(parent)

    def start_deploy(self, working_dir):
        self.setWorkingDirectory(working_dir)
        self.setProcessChannelMode(QProcess.MergedChannels)
        self.readyReadStandardOutput.connect(self.on_output)
        self.finished.connect(self.on_finished)
        self.start("cmd.exe", ["/c", "dp.cmd"])

    def on_output(self):
        data = self.readAllStandardOutput().data().decode('utf-8', errors='replace')
        self.log_signal.emit(data)

    def on_finished(self, code, status):
        self.log_signal.emit(f"\n--- 部署进程结束，退出码: {code} ---\n")


# =========================== 主窗口 ===========================
class MainWindow(QMainWindow):
    def __init__(self):
        super().__init__()
        if not ensure_dependencies():
            sys.exit(1)

        self.setWindowTitle("Twilight 博客管理器 - 深空科技版")
        self.setGeometry(100, 100, 1300, 850)

        self.posts_dir = get_posts_dir()
        self.dp_cmd = get_dp_cmd_path()
        self.deploy_process = None

        self.init_ui()
        self.apply_dark_style()

        self.article_list.refresh()

    def init_ui(self):
        central = QWidget()
        self.setCentralWidget(central)
        main_layout = QVBoxLayout(central)
        main_layout.setContentsMargins(8, 8, 8, 8)
        main_layout.setSpacing(8)

        # 工具栏
        toolbar = QHBoxLayout()
        self.new_file_btn = QPushButton("📄 新建单文件文章")
        self.new_folder_btn = QPushButton("📁 新建文件夹文章")
        self.save_btn = QPushButton("💾 保存")
        self.refresh_btn = QPushButton("🔄 刷新列表")
        self.deploy_btn = QPushButton("🚀 构建并部署")
        toolbar.addWidget(self.new_file_btn)
        toolbar.addWidget(self.new_folder_btn)
        toolbar.addWidget(self.save_btn)
        toolbar.addWidget(self.refresh_btn)
        toolbar.addStretch()
        toolbar.addWidget(self.deploy_btn)
        main_layout.addLayout(toolbar)

        # 分割器
        splitter = QSplitter(Qt.Horizontal)
        self.article_list = ArticleList()
        self.article_list.article_selected.connect(self.on_article_selected)
        splitter.addWidget(self.article_list)

        self.editor = ArticleEditor()
        splitter.addWidget(self.editor)
        splitter.setSizes([350, 950])
        main_layout.addWidget(splitter)

        # 日志区域
        log_group = QGroupBox("📡 部署日志")
        log_layout = QVBoxLayout()
        self.log_text = QTextEdit()
        self.log_text.setReadOnly(True)
        self.log_text.setMaximumHeight(150)
        log_layout.addWidget(self.log_text)
        log_group.setLayout(log_layout)
        main_layout.addWidget(log_group)

        # 连接信号
        self.new_file_btn.clicked.connect(lambda: self.new_article('file'))
        self.new_folder_btn.clicked.connect(lambda: self.new_article('folder'))
        self.save_btn.clicked.connect(self.save_current_article)
        self.refresh_btn.clicked.connect(self.article_list.refresh)
        self.deploy_btn.clicked.connect(self.run_deploy)

    def apply_dark_style(self):
        self.setStyleSheet(DARK_STYLE)

    def new_article(self, art_type):
        """新建文章"""
        title, ok = QInputDialog.getText(self, "新建文章", "请输入文章标题:")
        if not ok or not title.strip():
            return

        slug = slugify(title)
        posts_dir = self.posts_dir

        if art_type == 'file':
            filepath = os.path.join(posts_dir, f"{slug}.md")
            if os.path.exists(filepath):
                QMessageBox.warning(self, "已存在", f"文章 {slug}.md 已存在")
                return
            # 创建基础 frontmatter
            metadata = {
                "title": title,
                "description": "",
                "published": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
                "tags": [],
                "draft": True,
                "comment": True,
            }
            content = f"# {title}\n\n开始写作..."
            if save_markdown_file(filepath, metadata, content):
                self.article_list.refresh()
                self.editor.load_from_path(filepath, 'file', slug)
            else:
                QMessageBox.critical(self, "错误", "创建文件失败")

        else:  # folder
            folder_path = os.path.join(posts_dir, slug)
            if os.path.exists(folder_path):
                QMessageBox.warning(self, "已存在", f"文件夹 {slug} 已存在")
                return
            os.makedirs(folder_path)
            index_path = os.path.join(folder_path, "index.md")
            metadata = {
                "title": title,
                "description": "",
                "published": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
                "tags": [],
                "draft": True,
                "comment": True,
                "image": {"url": "./cover.jpg", "alt": "封面"}
            }
            content = f"# {title}\n\n开始写作..."
            if save_markdown_file(index_path, metadata, content):
                self.article_list.refresh()
                self.editor.load_from_path(index_path, 'folder', slug)
            else:
                QMessageBox.critical(self, "错误", "创建文章失败")

    def save_current_article(self):
        if not self.editor.current_path:
            QMessageBox.warning(self, "警告", "没有打开任何文章")
            return
        if self.editor.save_current():
            self.article_list.refresh()
            QMessageBox.information(self, "成功", "文章已保存")
        else:
            QMessageBox.critical(self, "错误", "保存失败")

    def on_article_selected(self, index_path, art_type, url_slug):
        self.editor.load_from_path(index_path, art_type, url_slug)

    def run_deploy(self):
        if not os.path.exists(self.dp_cmd):
            QMessageBox.critical(self, "错误", f"找不到部署脚本 {self.dp_cmd}")
            return

        self.log_text.clear()
        self.log_text.append("🚀 开始执行部署...\n")
        self.deploy_btn.setEnabled(False)

        self.deploy_process = DeployProcess(self)
        self.deploy_process.log_signal.connect(self.log_text.append)
        self.deploy_process.finished.connect(self.on_deploy_finished)

        work_dir = os.path.dirname(self.dp_cmd)
        self.deploy_process.start_deploy(work_dir)

    def on_deploy_finished(self):
        self.deploy_btn.setEnabled(True)
        self.log_text.append("\n✅ 部署任务结束。")

    def closeEvent(self, event):
        event.accept()


def main():
    app = QApplication(sys.argv)
    window = MainWindow()
    window.show()
    sys.exit(app.exec_())


if __name__ == "__main__":
    main()