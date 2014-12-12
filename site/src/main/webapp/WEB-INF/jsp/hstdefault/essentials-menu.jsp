<%@ include file="/WEB-INF/jsp/include/imports.jsp" %>
<%--
  Copyright 2014 Hippo B.V. (http://www.onehippo.com)

  Licensed under the Apache License, Version 2.0 (the "License");
  you may not use this file except in compliance with the License.
  You may obtain a copy of the License at

   http://www.apache.org/licenses/LICENSE-2.0

  Unless required by applicable law or agreed to in writing, software
  distributed under the License is distributed on an "AS IS" BASIS,
  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  See the License for the specific language governing permissions and
  limitations under the License.
  --%>

<%--@elvariable id="menu" type="org.hippoecm.hst.core.sitemenu.HstSiteMenu"--%>
<c:if test="${not empty menu}">
  <ul class="nav nav-pills">
    <c:forEach var="item" items="${menu.siteMenuItems}">
      <c:choose>
        <c:when test="${item.selected or item.expanded}">
          <li class="active"><a href="<hst:link link="${item.hstLink}"/>">${item.name}</a></li>
        </c:when>
        <c:otherwise>
          <li><a href="<hst:link link="${item.hstLink}"/>">${item.name}</a></li>
        </c:otherwise>
      </c:choose>
    </c:forEach>
  </ul>
  <hst:cmseditmenu menu="${menu}"/>
</c:if>
<%--@elvariable id="editMode" type="java.lang.Boolean"--%>
<c:if test="${editMode && empty menu}">
  <img src="<hst:link path='/images/essentials/catalog-component-icons/menu.png'/>"> Click to edit Menu
</c:if>
